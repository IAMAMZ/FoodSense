"use client"; // Ensure this is a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use the new router from app directory

const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "",
    dietaryPreferences: [],
    calorieTarget: "",
    proteinRatio: "",
    carbRatio: "",
    fatRatio: "",
  });

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Keto",
    "Paleo",
    "Halal",
    "Kosher",
  ];

  // State to store user info fetched from the API
  const [userInfo, setUserInfo] = useState(null);

  const router = useRouter(); // Using the new router from next/navigation

  // Fetch existing user data from the server
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("/api/userInfo");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...data,
            dietaryPreferences: data.dietaryPreferences || [],
          }));
        } else {
          console.error("Failed to fetch user info.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let updatedPreferences = [...formData.dietaryPreferences];
      if (checked) {
        updatedPreferences.push(value);
      } else {
        updatedPreferences = updatedPreferences.filter(
          (pref) => pref !== value
        );
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        dietaryPreferences: updatedPreferences,
      }));
    } else if (type === "number") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalRatio =
      Number(formData.proteinRatio) +
      Number(formData.carbRatio) +
      Number(formData.fatRatio);

    if (totalRatio !== 100) {
      alert("Macronutrient ratios must add up to 100%.");
      return;
    }

    try {
      const processedFormData = {
        ...formData,
        age: formData.age !== "" ? Number(formData.age) : undefined,
        height: formData.height !== "" ? Number(formData.height) : undefined,
        weight: formData.weight !== "" ? Number(formData.weight) : undefined,
        calorieTarget:
          formData.calorieTarget !== ""
            ? Number(formData.calorieTarget)
            : undefined,
        proteinRatio:
          formData.proteinRatio !== ""
            ? Number(formData.proteinRatio)
            : undefined,
        carbRatio:
          formData.carbRatio !== "" ? Number(formData.carbRatio) : undefined,
        fatRatio:
          formData.fatRatio !== "" ? Number(formData.fatRatio) : undefined,
      };

      // const response = await fetch("/api/userInfo", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(processedFormData),
      // });

      if (true) {
        alert("Information saved successfully.");
        router.push("/camera"); // Redirect to /camera after success
      } else {
        alert("An error occurred while saving your information.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving your information.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        User Information
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
            placeholder="Enter your age"
            required
          />
        </div>
        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-3"
            required
          >
            <option value="" disabled>
              Select your gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="nonBinary">Non-binary</option>
            <option value="preferNotToSay">Prefer not to say</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Height */}
        <div className="mb-4">
          <label className="block text-gray-700">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
            placeholder="Enter your height"
            required
          />
        </div>
        {/* Weight */}
        <div className="mb-4">
          <label className="block text-gray-700">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
            placeholder="Enter your weight"
            required
          />
        </div>
        {/* Activity Level */}
        <div className="mb-4">
          <label className="block text-gray-700">Activity Level</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-3"
            required
          >
            <option value="" disabled>
              Select your activity level
            </option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
            <option value="Extra Active">Extra Active</option>
          </select>
        </div>
        {/* Goal */}
        <div className="mb-4">
          <label className="block text-gray-700">Goal</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-3"
            required
          >
            <option value="" disabled>
              Select your goal
            </option>
            <option value="Lose Weight">Lose Weight</option>
            <option value="Maintain Weight">Maintain Weight</option>
            <option value="Gain Muscle">Gain Muscle</option>
          </select>
        </div>
        {/* Dietary Preferences */}
        <div className="mb-4">
          <label className="block text-gray-700">Dietary Preferences</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {dietaryOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name="dietaryPreferences"
                  value={option}
                  checked={formData.dietaryPreferences.includes(option)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        {/* Calorie Target */}
        <div className="mb-4">
          <label className="block text-gray-700">Calorie Target (optional)</label>
          <input
            type="number"
            name="calorieTarget"
            value={formData.calorieTarget}
            onChange={handleChange}
            className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
            placeholder="Enter your calorie target"
          />
        </div>
        {/* Macronutrient Ratios */}
        <div className="mb-4">
          <label className="block text-gray-700">Macronutrient Ratios (%)</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <label className="block text-gray-700">Protein</label>
              <input
                type="number"
                name="proteinRatio"
                value={formData.proteinRatio}
                onChange={handleChange}
                className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
                placeholder="Protein %"
              />
            </div>
            <div>
              <label className="block text-gray-700">Carbs</label>
              <input
                type="number"
                name="carbRatio"
                value={formData.carbRatio}
                onChange={handleChange}
                className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
                placeholder="Carbs %"
              />
            </div>
            <div>
              <label className="block text-gray-700">Fat</label>
              <input
                type="number"
                name="fatRatio"
                value={formData.fatRatio}
                onChange={handleChange}
                className="mt-1 block w-full border-black border bg-silver text-black placeholder-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-12 p-4"
                placeholder="Fat %"
              />
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;
