"use client";

import React from "react";
import { WifiOff, X } from "lucide-react";

interface NetworkConnectionModalProps {
  onRetry: () => void;
  onClose: () => void;
}

const NetworkConnectionModal: React.FC<NetworkConnectionModalProps> = ({
  onRetry,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <WifiOff className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          No Internet Connection
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          Please check your internet connection and try again. Make sure you're
          connected to Wi-Fi or mobile data.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Retry
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition"
          >
            Close
          </button>
        </div>

        {/* Close icon (optional top corner) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NetworkConnectionModal;
