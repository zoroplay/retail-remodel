// Migrated to web/Next.js: use div, button, etc. with Tailwind CSS
import React from "react";
// import { useAppSelector } from "@/hooks/useAppDispatch";

const ChooseMonth = ({ onClose }: { onClose: () => void }) => {
  // const { props } = useAppSelector((state) => state.modal);
  // const months = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-lg p-4">
      {/* <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <button
            key={month}
            className={`p-3 rounded-lg border flex justify-center items-center h-12 transition-colors ${
              props?.currentDate.getMonth() === index
                ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                : "border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => {
              props?.handleMonthSelect(index);
              onClose();
            }}
          >
            <span
              className={`text-center text-lg ${
                props?.currentDate.getMonth() === index
                  ? "text-blue-500 dark:text-blue-300 font-semibold"
                  : "text-gray-800 dark:text-white"
              }`}
            >
              {month}
            </span>
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default ChooseMonth;
