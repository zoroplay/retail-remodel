import { getClientTheme } from "@/config/theme.config";
import React from "react";
const { classes } = getClientTheme();

const TournamentSkeleton = () => {
  return (
    <div className={`space-y-1 p-2 ${classes["skeleton-bg"]}`}>
      {[...Array(2)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center justify-between pl-4 pr-3 py-1">
            <div className="flex items-center gap-2 w-full">
              <div
                className={`h-3 ${classes["skeleton-bg"]} rounded w-full`}
              ></div>
              <div
                className={`h-3 ${classes["skeleton-bg"]} rounded-full w-6`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentSkeleton;
