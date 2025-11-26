import React from "react";

const CategorySkeleton = () => {
  return (
    <div className="space-y-2 p-3 bg-slate-800/30 border-t border-gray-600/50">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center justify-between pl-6 pr-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-600 rounded w-24"></div>
              <div className="h-4 bg-gray-700 rounded-full w-8"></div>
            </div>
            <div className="h-3 w-3 bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
