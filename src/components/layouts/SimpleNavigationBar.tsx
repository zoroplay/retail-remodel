import React from "react";
import { useNavigate } from "react-router-dom";

interface NavigationBarProps {
  activeTab?: "sports" | "live" | "prematch";
  onTabPress?: (tab: "sports" | "live" | "prematch") => void;
  onSearchPress?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = React.memo(
  ({ activeTab = "sports", onTabPress, onSearchPress }) => {
    const navigate = useNavigate();

    return (
      <div className="bg-gray-800 flex items-center justify-between px-4 gap-2 py-3 w-full">
        {/* Left Section - Menu and Sports Button */}
        <div className="flex items-center gap-2 w-1/7">
          <button
            onClick={() => navigate('/debug')}
            className="bg-blue-600 w-10 h-12 rounded flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-white text-xl">☰</span>
            <div className="bg-black/20 h-5 px-1 rounded flex items-center justify-center">
              <p className="text-white font-semibold text-center text-xs">*#*</p>
            </div>
          </button>

          <button
            onClick={() => onTabPress?.("sports")}
            className={`px-4 py-2 rounded h-10 cursor-pointer ${
              activeTab === "sports" ? "bg-blue-600" : "bg-blue-500"
            }`}
          >
            <p className="text-white font-semibold">Sports</p>
          </button>
        </div>

        {/* Middle Section - Search Inputs */}
        <div className="flex items-center justify-center gap-2 w-3/6">
          <div className="flex-1 items-center justify-center gap-2">
            <input
              placeholder="Insert Booking Number"
              className="w-full h-9 px-3 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1 items-center justify-center gap-2">
            <input
              placeholder="Insert Coupon Code"
              className="w-full h-9 px-3 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Right Section - Search and Tab Buttons */}
        <div className="flex items-center gap-2 w-2/6">
          <button
            onClick={() => onTabPress?.("live")}
            className={`px-4 py-2 rounded cursor-pointer ${
              activeTab === "live" ? "bg-blue-600" : "bg-white"
            }`}
          >
            <p
              className={`font-semibold ${
                activeTab === "live" ? "text-white" : "text-gray-700"
              }`}
            >
              Live **1
            </p>
          </button>

          <button
            onClick={() => onTabPress?.("prematch")}
            className={`px-4 py-2 rounded cursor-pointer ${
              activeTab === "prematch" ? "bg-blue-600" : "bg-white"
            }`}
          >
            <p
              className={`font-semibold ${
                activeTab === "prematch" ? "text-white" : "text-gray-700"
              }`}
            >
              Prematch **2
            </p>
          </button>
        </div>
      </div>
    );
  }
);

export default NavigationBar;