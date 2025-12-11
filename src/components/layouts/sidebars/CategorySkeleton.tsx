import { getClientTheme } from "@/config/theme.config";
import React from "react";
const { classes } = getClientTheme();

const CategorySkeleton = () => {
  return (
    <div
      className={`space-y-1 p-2  ${classes["skeleton-bg"]} border-t border-gray-600/50`}
    >
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex gap-1 items-center justify-between pl-3 pr-2 py-1">
            <div className="flex items-center gap-2 w-full ">
              <div
                className={`h-4 ${classes["skeleton-bg"]} rounded w-full`}
              ></div>
              <div
                className={`h-4 ${classes["skeleton-bg"]} rounded-full w-8`}
              ></div>
            </div>
            <div className={`h-4 w-4 ${classes["skeleton-bg"]} rounded`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
