// CameraComponent.js
"use client";
import React, { useRef, useEffect, useState } from "react";
import io from 'socket.io-client';  // Make sure to import socket.io-client

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const socket = useRef(null);  // Added socket reference
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to detect if the device is mobile
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

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
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        // Set the video source to the stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    startCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (socket.current) {
        socket.current.disconnect();  // Disconnect socket on cleanup
      }
    };
  }, []);

  // Function to capture a frame from the video
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the image data URL
      const imageDataURL = canvas.toDataURL('image/png');

      // Now you can send 'imageDataURL' to your backend or process it in-browser
      console.log('Captured frame:', imageDataURL);
      // Example: processImage(imageDataURL);
    }
  };

  // Use an interval to capture frames periodically
  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 1000); // Capture a frame every 1 second

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', height: 'auto' }}
      />
      {/* Hidden canvas element for capturing frames */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {isProcessing && <p>Processing...</p>}
    </div>
  );
};

export default CameraComponent;
