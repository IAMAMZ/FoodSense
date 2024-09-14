// CameraComponent.js
"use client";
import React, { useRef, useEffect, useState } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to detect if the device is mobile
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  useEffect(() => {
    // Function to start the camera
    const startCamera = async () => {
      try {
        // Decide which camera to use based on device type
        const constraints = {
          video: {
            facingMode: isMobileDevice() ? { exact: "environment" } : "user",
          },
        };

        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
    };
  }, []);

  // Function to capture a frame from the video
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match the video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame from the video onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data URL
        const imageDataURL = canvas.toDataURL("image/png");

        // Now you can send 'imageDataURL' to your backend or process it in-browser
        console.log("Captured frame:", imageDataURL);
        // Example: processImage(imageDataURL);
      }
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
    <div className="relative w-full h-screen">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-3/4 object-cover" // Takes 3/4 of screen height in mobile view
      />
      {/* Hidden canvas element for capturing frames */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {isProcessing && <p>Processing...</p>}
    </div>
  );
};

export default CameraComponent;
