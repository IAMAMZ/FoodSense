import UserInfoForm from "@/components/UserInfo";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen overflow-y-auto p-4">
      <div className="flex items-center mb-8">
        <div className="relative w-12 h-12">
          <Image
            src="/media/Logo_1.png"
            alt="FoodSense logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="text-2xl font-bold text-gray-800 ml-4">FoodSense</p>
      </div>
      <UserInfoForm />
    </div>
  );
}
