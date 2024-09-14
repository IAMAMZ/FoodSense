"use client"; 
import { useSearchParams, useRouter } from 'next/navigation'; // Use next/navigation
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';

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
      <div className="absolute top-4 left-4 cursor-pointer" onClick={() => router.back()}>
        <MdCancel size={32} />
      </div>

      {/* Logo */}
      <div className="my-8">
        <Image
          src="/media/Logo_1.png"
          alt="food"
          width={30}
          height={30}
          className="object-cover object-center"
        />
      </div>

      {/* Macros Section */}
      <div className="bg-green-100 rounded-lg py-4 mb-8 w-full max-w-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">Protein</span>
            <span className='text-lg'>{protein}g</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">Calories</span>
            <span className="text-lg">{calories}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">Carbs</span>
            <span className='text-lg'>{carbs}g</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">Fat</span>
            <span className='text-lg'>{fat}g</span>
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
      <div className="flex space-x-4">
        <button className="bg-green-500 text-white py-2 px-4 rounded-full">
          View Saved Meals
        </button>
        <button className="bg-black text-white py-2 px-4 rounded-full">
          Scan Another Meal
        </button>
      </div>
    </div>
  );
}
