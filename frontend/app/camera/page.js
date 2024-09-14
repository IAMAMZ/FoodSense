"use client";
import { useEffect, useState } from "react";
import CameraComponent from "@/components/Camera";
import ImageFeedback from "@/components/ImageFeedback";
import io from "socket.io-client";
import baseurl from "@/baseurl";

let socket;

export default function Page() {
  // State to store real-time nutrition values
  const [nutritionData, setNutritionData] = useState({
    calories: 30,
    protein: 20,
    carbs: 10,
    fat: 3,
    weight:30,
  });

  // Effect to set up the WebSocket connection and listen for updates
  useEffect(() => {
    // Initialize the WebSocket connection
    socket = io(baseurl);
    // Listen for 'nutrition-update' event from the server
    socket.on("nutrition-update", (data) => {
      setNutritionData(data);
    });

    // Clean up when the component unmounts
    return () => {
      socket.off("nutrition-update");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col justify-start items-center min-h-screen overflow-y-auto">
      <CameraComponent />
      <ImageFeedback
        status="Scanning ..."
        calories={nutritionData.calories}
        protein={nutritionData.protein}
        carbs={nutritionData.carbs}
        fat={nutritionData.fat}
      />
    </div>
  );
}
