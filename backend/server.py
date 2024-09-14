#  create a flask app and open a stream endpoint for video feed to come in and we process it

from flask import Flask, request, Response
import cv2
import numpy as np

# pip install opencv-python flask numpy pillow 

import base64
import json

app = Flask(__name__)

@app.route('/video', methods=['POST'])
def video():
    data = request.data
    data = json.loads(data)
    img = base64.b64decode(data['img'])
    npimg = np.fromstring(img, dtype=np.uint8)
    img = cv2.imdecode(npimg, 1)
    cv2.imshow('frame', img)
    cv2.waitKey(1)
    return Response(response='OK', status=200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
