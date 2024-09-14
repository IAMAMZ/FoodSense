import openai
import base64
import numpy as np
import cv2
import threading
import time
import signal
import sys
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import json
import re

# OpenAI API Key
# Replace with your OpenAI API key
openai.api_key = ""

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables
latest_frame = None
shutdown_flag = False

# Function to encode the image


def encode_image_from_frame(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8')

# Function to call OpenAI GPT-4 Vision API with a frame


def process_with_openai(base64_image):
    try:
        # Send the image to OpenAI GPT-4 Vision API
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Replace with the correct GPT-4 model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": """name all the ingredients of the food that you see in the image. Now give the macros values per 100gm in JSON format along with name. Also read the weight of the food from the image and provide it in the JSON. For example: 
                                {  "name": ,
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

        # Print the structured JSON response
        message = response.choices[0].message.content
        match = re.search(r'```json\s*(\{.*?\})\s*```', message, re.DOTALL)
        if match:
            json_str = match.group(1)
            # Parse the JSON content
            data = json.loads(json_str)
            print(data)
        else:
            print(message)
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")

# Handle incoming video frames from the frontend


@socketio.on('video_frame')
def handle_video_frame(data):
    global latest_frame
    try:
        if not data:
            print("Empty frame received")
            return

        # Decode base64 image
        img_data = base64.b64decode(data)

        # Convert byte data into a numpy array
        npimg = np.frombuffer(img_data, dtype=np.uint8)

        # Decode the image to OpenCV format
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if frame is None:
            print("Failed to decode image. Data might be corrupted.")
            return

        # Update the global variable with the latest frame
        latest_frame = frame

    except Exception as e:
        print(f"Error processing frame: {e}")

# Function to display video and process every 10th second frame


def display_and_process_video_feed():
    global latest_frame, shutdown_flag
    last_openai_time = 0

    while not shutdown_flag:
        if latest_frame is not None:
            # Display the latest frame in a single OpenCV window
            cv2.imshow('Video Feed', latest_frame)

            current_time = time.time()

            # Check if 10 seconds have passed since the last OpenAI call
            if current_time - last_openai_time >= 10:
                last_openai_time = current_time

                # Convert the current frame to base64 and send it to OpenAI GPT-4 Vision
                base64_image = encode_image_from_frame(latest_frame)
                process_with_openai(base64_image)

        # Exit the window loop if 'q' is pressed or shutdown_flag is set
        if cv2.waitKey(1) & 0xFF == ord('q'):
            shutdown_flag = True
            break

    # Close the OpenCV window when done
    cv2.destroyAllWindows()

# Function to start the Socket.IO server in a separate thread


def start_socketio_server():
    socketio.run(app, host='0.0.0.0', port=5000)

# Signal handler for clean shutdown


def signal_handler(sig, frame):
    global shutdown_flag
    print('Shutting down...')
    shutdown_flag = True
    # Stop the SocketIO server
    socketio.stop()  # This works for certain async modes (such as eventlet)
    sys.exit(0)  # Ensure the program exits


# Register the signal handler to handle Ctrl+C
signal.signal(signal.SIGINT, signal_handler)

if __name__ == '__main__':
    # Start the Socket.IO server in a separate thread
    socketio_thread = threading.Thread(target=start_socketio_server)
    socketio_thread.start()

    # Run the OpenCV video display and process the frame every 10 seconds
    display_and_process_video_feed()
