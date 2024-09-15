"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { MdCancelPresentation } from "react-icons/md";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import baseurl from "@/baseurl";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get query parameters with fallback values
    const name = searchParams.get("name") || "";
    const protein = searchParams.get('protein') || 0;
    const fat = searchParams.get('fat') || 0;
    const carbs = searchParams.get('carbs') || 0;
    const calories = searchParams.get('calories') || 0;

    // State to store the advice and ingredients from the server response
    const [advice, setAdvice] = useState("");
    const [ingredients, setIngredients] = useState([]);

    // Effect to send POST request on component mount
    useEffect(() => {
        async function fetchAdviceAndIngredients() {
            try {
                const response = await fetch( baseurl+'/advice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        protein,
                        fat,
                        carbs,
                        calories,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setAdvice(data.advice);
                    setIngredients(data.ingredients);
                } else {
                    console.error("Failed to fetch advice and ingredients");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchAdviceAndIngredients();
    }, [name, protein, fat, carbs, calories]);

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col justify-start items-center min-h-screen relative w-full">
          {/* Cancel Button */}
          <div className="absolute top-3 left-3 cursor-pointer" onClick={() => router.back()}>
            <MdCancelPresentation size={32} />
          </div>

          {/* Logo */}
          <div className="mt-16 mb-10"> {/* Added more top margin */}
            <Image
              src="/media/Logo_1.png"
              alt="food"
              width={30}
              height={30}
              className="object-cover object-center"
            />
          </div>

          {/* Macros Section */}
          <div className="bg-[#FAFFEF] rounded-lg py-4 mb-8 w-full max-w-sm">
            <div className="flex items-center justify-between p-3">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-2xl">Protein</span>
                <span className='text-2xl'>{protein}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-2xl">Calories</span>
                <span className="text-2xl">{calories}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-2xl">Carbs</span>
                <span className='text-2xl'>{carbs}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-2xl">Fat</span>
                <span className='text-2xl'>{fat}g</span>
              </div>
            </div>
          </div>

          {/* Coaching Advice Section */}
          <div className="text-center mb-8">
            <h2 className="font-semibold mb-2">Coaching Advice</h2>
            <p>{advice ? advice : "Loading advice..."}</p>
          </div>

          {/* Ingredients Section */}
          <div className="text-center mb-8">
            <h2 className="font-semibold mb-2">Ingredients</h2>
            {ingredients.length > 0 ? (
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>Loading ingredients...</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-10 w-full p-2">
            <button className="bg-[#BBF246;] w-[60%] text-black text-lg py-2 px-4 rounded-full max-w-sm mx-auto">
              View Saved Meals
            </button>
            <button
              onClick={() => router.back()}
              className="bg-black text-white w-[60%] text-lg py-2 px-4 rounded-full max-w-sm mx-auto">
              Scan Another Meal
            </button>
          </div>
        </div>
      </Suspense>
    );
  }
