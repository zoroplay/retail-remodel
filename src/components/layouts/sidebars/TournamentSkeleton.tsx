import React from "react";

const TournamentSkeleton = () => {
  return (
    <div className="space-y-1 p-2 bg-slate-700/20">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center justify-between pl-8 pr-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gray-600 rounded w-20"></div>
              <div className="h-3 bg-gray-700 rounded-full w-6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentSkeleton;
