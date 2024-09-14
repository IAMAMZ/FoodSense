import CameraComponent from "@/components/Camera";
import UserInfoForm from "@/components/UserInfo";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen overflow-y-auto">
       <CameraComponent/>
    </div>
  );
}
