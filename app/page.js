import UserInfoForm from "@/components/UserInfo";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen overflow-y-auto">
      <div className="relative w-full" style={{ height: "75vh" }}>
        <Image
          src="/media/food1.jpg"
          alt="food"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl font-bold mt-4">
          Making Your Food Make{" "}
          <span className="bg-green-300 px-0 py-0 rounded-lg">Sense</span>
        </h1>
        <h2 className="text-gray-500 text-base mt-2">
          Your AI Nutrition Coach
        </h2>
        <Link href="/GetInfo" className="bg-black text-white px-6 py-3 mt-6 rounded-full">
          Get Started
        </Link>
      </div>
    </div>
  );
}
