"use client";
import React, { useRef, useEffect, useState } from "react";
import io from 'socket.io-client';  // Import socket.io-client
import ImageFeedback from "./ImageFeedback";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const socket = useRef(null);

  // Corrected useState declaration with missing comma
  const [nutritionData, setNutritionData] = useState({
    status: "Scanning...",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    weight: 0,
  });

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  useEffect(() => {
    console.log('Connecting to the server...');
    
    socket.current = io("https://htnbackend.bhairawaryan.com", {
      transports: ['websocket'],
    });
  
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
  
    // Listen for nutrition updates from the server
    socket.current.on("update", (data) => {
      console.log("Nutrition Update", data);
  
      // Update the state with the received nutrition data
      const result = data.Result;
      setNutritionData({
        status: result?.name || "Unknown Food",
        calories: result?.carbs || 0,  
        protein: result?.proteins || 0,
        carbs: result?.carbs || 0,
        fat: result?.fats || 0,
        weight: result?.['weight-reading'] || 0
      });
    });
  
    socket.current.on('disconnect', (reason) => {
      console.log(`Disconnected from WebSocket server: ${reason}`);
    });
  
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: isMobileDevice() ? { exact: "environment" } : "user",
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        streamRef.current = stream;
  
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    startCamera();
  
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (socket.current) {
        socket.current.disconnect();
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

      const imageDataURL = canvas.toDataURL('image/jpeg');
      const base64Image = imageDataURL.split(',')[1];  // Extract base64 data only
      console.log('Sending frame to server');
      
      socket.current.emit('frame', base64Image);  // Send base64 string to the server
    }
  };

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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <ImageFeedback
  status={nutritionData?.status || "Scanning..."}
  calories={nutritionData?.calories || 0}
  protein={nutritionData?.protein || 0}
  carbs={nutritionData?.carbs || 0}
  fat={nutritionData?.fat || 0}
/>

    </div>
  );
};

export default CameraComponent;
