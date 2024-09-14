// ImageFeedback.js
import { IoBarChart } from "react-icons/io5";

export default function ImageFeedback({status,calories,protein,fat,carbs,FinishScan}) {

    return (
    <div className="flex flex-col align-center justify-center rounded-lg bg-white p-4 shadow-lg absolute bottom-0 left-0 right-0 mx-4 mb-6 rounded-xl z-10">
        <div className="font-bold flex justify-center align-center text-xl mb-2">{status}</div>
        <div className="flex justify-center align-center mb-4 gap-3 text-sm">
            <div className="flex justify-center"> {calories}g Calories</div>
            <div className="flex justify-center"> {protein}g Protein </div>
            <div className="flex justify-center"> {fat}g Fat </div>
            <div className="flex justify-center"> {carbs}g Carbs</div>
        </div>
        <div className="flex justify-center align-center">
            <button
            className="bg-[#BBF246] text-black rounded-lg py-2 px-6 flex align-center justify-center"
            onClick={FinishScan}>
                <IoBarChart className="mr-2"/>
                Finish Scan
            </button>
        </div>
    </div>)
}
