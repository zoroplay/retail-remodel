// Migrated to web/Next.js: use div, button, etc. with Tailwind CSS
import React from "react";
// import { useAppSelector } from "@/hooks/useAppDispatch";

const ChooseYear = ({ onClose }: { onClose: () => void }) => {
  // const { props } = useAppSelector((state) => state.modal);

  return (
    <div>
      {/* {props?.options.map((option: any) => (
        <button
          key={option.id}
          className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 transition-colors ${
            props?.value === option.id
              ? "bg-blue-500"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          onClick={() => {
            props?.onChange(option.id);
            onClose();
          }}
        >
          <span
            className={`text-base ${
              props?.value === option.id
                ? "text-white dark:text-white font-semibold"
                : "text-gray-800 dark:text-white"
            }`}
          >
            {option.name}
          </span>
        </button>
      ))} */}
    </div>
  );
};

export default ChooseYear;
