"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import Modal from "../Modal";

interface SuccessModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  message,
  onClose,
}) => {
  return (
    <Modal
      open={true}
      onOpenChange={(_open) => {
        if (!_open) onClose();
      }}
      className={`overflow-hidden max-w-[90vw] !w-[500px]  rounded-2xl backdrop-blur-xl border border-slate-700/50 text-gray-100 shadow-2xl shadow-black/50
           `}
      footer={
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-sm hover:bg-green-600 text-white font-semibold py-2 rounded-md  transition"
        >
          Continue
        </button>
      }
      header={
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 flex-1">{title}</h2>
        </div>
      }
    >
      <div className="flex items-center justify-center text-sm">
        <p className="text-gray-600 leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
};

export default SuccessModal;
