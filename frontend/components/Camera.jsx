"use client";

import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    console.log('Connecting to the server...');
    
    // Force the use of WebSocket as the transport mechanism
    socket.current = io('http://localhost:5000', {
      transports: ['websocket'],  // Use WebSocket transport explicitly
    });

    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.current.on('disconnect', (reason) => {
      console.log(`Disconnected from WebSocket server: ${reason}`);
    });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };
    startCamera();

    const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataURL = canvas.toDataURL('image/jpeg');
        const base64Image = imageDataURL.split(',')[1];  // Extract base64 data only
        // console.log('Sending frame to server');
        socket.current.emit('video_frame', base64Image);  // Send base64 string
      }
    };

    const interval = setInterval(captureFrame, 100);  // Capture frame every 100ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraComponent;
