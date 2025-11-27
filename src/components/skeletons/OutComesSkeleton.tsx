import React from "react";

type Props = {};

export const SkeletonCard = ({ title }: { title: string }) => (
  <div className="rounded-2xl shadow-lg p1 animate-pulse">
    <div className="mb-2 border rounded-lg bg-gray-700/80 border-gray-700/80">
      <div className="w-full flex items-center justify-between px-3 py-2 text-left">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-700/50 rounded-full" />
          <span className="font-semibold text-gray-400/50 text-sm">
            {title}
          </span>
          <div className="h-4 w-4 bg-gray-600 rounded-full ml-1" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full px-3 pb-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="min-w-[90px] h-10 bg-gray-700/50 rounded-xl"
          />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTitle = () => (
  <div className="flex flex-col gap-2 animate-pulse w-full">
    <div className="h-6  bg-gray-700/50 rounded" />
    <div className="flex justify-between items-center gap-2">
      <div className="h-4 w-1/2 bg-gray-700/50 rounded" />
      <div className="h-4 w-1/2 bg-gray-700/50 rounded" />
    </div>
  </div>
);
