import openai

from flask_cors import CORS
from flask import Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
import base64
import json
import re
import openai
import asyncio
from flask import Flask
from flask_socketio import SocketIO, emit

# Create Flask app and configure SocketIO for WebSockets
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='asyncio')  # 'eventlet' for async support

@app.route('/')
def home():
    return "Hello, World!"

# Async function to analyze the frame using ChatGPT
async def analyze_frame_with_chatgpt(base64_image)
    socketio.emit('update', "Processing frame")  # Just to test emit during async
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": """
                        name all the ingredients of the food that you see in the image. Now give the macros values per 100gm in JSON format along with name. Also read the weight of the food from the image and provide it in the JSON. 
                        For example: 
                        {  
                            "name": ,
                            "carbs": , 
                            "proteins": , 
                            "fats": ,
                            "weight-reading": 
                        } Just provide me the structured JSON and nothing else."""},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )

        # Extract the message content
        message = response.choices[0].message.content

        # Try to extract the JSON structure from the response
        match = re.search(r'```json\s*(\{.*?\})\s*```', message, re.DOTALL)
        if not match:
            match = re.search(r'(\{.*?\})', message, re.DOTALL)

        if match:
            json_str = match.group(1)
            try:
                data = json.loads(json_str)
                return data
            except json.JSONDecodeError:
                return {"error": "Error decoding JSON"}
        else:
            return {"error": "Could not extract JSON"}

    except Exception as e:
        return {"error": str(e)}

# Async function to handle repeated analysis every 10 seconds
async def analyze_every_10_seconds(base64_image, sid):
    while True:
        # Call the async function to analyze the frame
        data = await analyze_frame_with_chatgpt(base64_image)

        # Emit the result back to the client
        await socketio.emit('nutrition-update', data, room=sid)

        # Sleep for 10 seconds asynchronously
        await asyncio.sleep(10)

# WebSocket route to handle incoming frame streams from the client
@socketio.on('frame')
async def handle_frame_stream(data):
    sid = request.sid
    frame = data

    print(f"Receiving frame from client with sid: {sid}")

    if not frame:
        await emit('error', {"error": "Frame data required"}, room=sid)
        return

    if isinstance(frame, str):
        frame = frame.encode('utf-8')

    # Convert the frame to base64 for ChatGPT
    base64_image = base64.b64encode(frame).decode('utf-8')

    # Start the background task to analyze the frame every 10 seconds
    asyncio.create_task(analyze_every_10_seconds(base64_image, sid))

# Start the Flask app with SocketIO
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=80, debug=True)
