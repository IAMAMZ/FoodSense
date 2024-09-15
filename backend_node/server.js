const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');
const base64 = require('base64-js');
const { OpenAI } = require('openai');

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,  // 1 minute (default is 5000 ms)
    pingInterval: 25000,  // 25 seconds (default is 25000 ms)
});


// Middleware to allow CORS for WebSocket connections
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Simple Home Route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Global variables for the frame and interval
let oldframe = null;
let intervalId = null;  // To track the interval

// Function to send frame to OpenAI's GPT-4 model for processing
async function analyzeFrameWithOpenAI(base64Image) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `
                name all the ingredients of the food that you see in the image. Now give the macros values per 100gm in JSON format along with name. Also read the weight of the food from the image and provide it in the JSON.
                For example: 
                {
                  "name": ,
                  "carbs": , 
                  "proteins": , 
                  "fats": ,
                  "weight-reading": 
                } Just provide me the structured JSON and nothing else.`,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });

        const data = await extractJsonFromResponse(response);
        return data;
    } catch (error) {
        console.error('Error analyzing frame:', error.message);
        return { error: error.message };
    }
}

// Function to extract JSON from the response
async function extractJsonFromResponse(response) {
    try {
        const message = response.choices[0].message.content;

        // Try to extract the JSON structure from the response
        let match = message.match(/```json\s*(\{.*?\})\s*```/s);
        if (!match) {
            match = message.match(/(\{.*?\})/s);
        }

        if (match) {
            const jsonStr = match[1];
            try {
                const data = JSON.parse(jsonStr);
                return data;
            } catch (error) {
                return { error: 'Error decoding JSON' };
            }
        } else {
            return { error: 'Could not extract JSON' };
        }
    } catch (error) {
        return { error: `Error: ${error.message}` };
    }
}

// WebSocket connection event
const clientIntervals = new Map();

// WebSocket connection event
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    let oldFrame = null;
    let intervalId = null;

    socket.on('frame', (data) => {
        if (!data) {
            socket.emit('error', { error: 'Frame data required' });
            return;
        }

        // Ensure data is in base64 format
        const base64Image = typeof data === 'string' ? data : base64.fromByteArray(data);
        oldFrame = base64Image;  // Update the old frame with the new one
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Clear the interval for this client when they disconnect
        if (intervalId) {
            clearInterval(intervalId);
            clientIntervals.delete(socket.id);  // Remove the client's interval from the map
        }
    });

    // Start the interval for this client
    if (!clientIntervals.has(socket.id)) {
        intervalId = setInterval(() => {
            if (oldFrame) {
                // Send a message with the last part of the frame and a sample result
                // console.log(oldFrame.slice(-10));
                // const message = {
                //     name: 'Sandwich',
                //     carbs: '40',
                //     proteins: '10',
                //     fats: '15',
                //     'weight-reading': '150'
                // };
                // console.log('Result:', 'message sent');
                // socket.emit('update', { Result: message });

                // Optionally, you can call your AI analysis function here
                analyzeFrameWithOpenAI(oldFrame).then((result) => {
                    console.log('Result:', result);
                    socket.emit('update', {'Result': result});
                });
            }
        }, 10000);  // Every second

        // Store the interval ID for this client
        clientIntervals.set(socket.id, intervalId);
    }
});

// Start the server
const PORT = 80;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
