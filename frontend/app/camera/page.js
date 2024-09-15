"use client";
import { useEffect, useState } from "react";
import CameraComponent from "@/components/Camera";
import ImageFeedback from "@/components/ImageFeedback";
import io from "socket.io-client";

let socket;

export default function Page() {
  // State to store real-time nutrition values
 

  // State to store the feedback status
  const [status, setStatus] = useState("Scanning...");

  // Effect to handle real-time nutrition data updates and status changes


  return (
    <div className="flex flex-col justify-start items-center min-h-screen overflow-y-auto">
      <CameraComponent  />
    </div>
  );
}
