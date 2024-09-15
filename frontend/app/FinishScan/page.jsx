"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { MdCancelPresentation } from "react-icons/md";
import Image from "next/image";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
  
    // Get query parameters with fallback values
    const protein = searchParams.get('protein') || 0;
    const fat = searchParams.get('fat') || 0;
    const carbs = searchParams.get('carbs') || 0;
    const calories = searchParams.get('calories') || 0;
  
    return (
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
          <p>
            Advice ..
            <br />
            ..
            <br />
            ..
            <br />
            ..
          </p>
        </div>
  
        {/* Ingredients Section */}
        <div className="text-center mb-8">
          <h2 className="font-semibold mb-2">Ingredients</h2>
          <p>Milk, Salt, Sugar, Butter</p>
        </div>
  
        {/* Buttons */}
        <div className="flex flex-col gap-10  w-full p-2">
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
    );
  }
