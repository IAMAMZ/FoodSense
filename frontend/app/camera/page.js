import CameraComponent from "@/components/Camera";
import UserInfoForm from "@/components/UserInfo";
import Image from "next/image";
import Link from "next/link";
import ImageFeedback from "@/components/ImageFeedback";
export default function Page() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen overflow-y-auto">
       <CameraComponent/>
       <ImageFeedback  status="Scanning ..."calories="30" protein="20" carbs="10" fat="3"/>
    </div>
  );
}
