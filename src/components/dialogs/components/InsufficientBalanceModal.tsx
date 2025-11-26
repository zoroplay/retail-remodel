"use client";

import React from "react";
import { XCircle, AlertTriangle } from "lucide-react";
import Modal from "../Modal";
import { useAppSelector } from "@/store/hooks/useAppDispatch";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";

interface InsufficientBalanceModalProps {
  onClose: () => void;
}

const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
  onClose,
}) => {
  const { title, props, description } = useAppSelector((state) => state.modal);
  const shortfall =
    Number(props?.required_amount || 0) - Number(props?.current_balance || 0);

  return (
    <Modal
      open={true}
      onOpenChange={(_open) => {
        if (!_open) onClose();
      }}
      className={`max-w-[90vw] !w-[500px]   backdrop-blur-xl border
           `}
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition text-sm"
          >
            Cancel
          </button>
          {/* {onDeposit && (
            <button
              onClick={onDeposit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
            >
              Deposit
            </button>
          )} */}
        </div>
      }
      header={
        <div className="flex items-center ">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <AlertTriangle className="text-red-500 w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 flex-1">{title}</h2>
        </div>
      }
    >
      <div className="flex flex-col gap-4 items-center justify-center ">
        {/* Header */}

        {/* Message */}
        <p className="text-gray-600 leading-6 text-sm">{description}</p>

        {/* Balance Details */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-700 font-medium">Current Balance:</span>
            <span className="text-gray-900 font-semibold">
              <CurrencyFormatter
                amount={props?.current_balance ?? 0}
                className=""
                spanClassName=""
              />
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-700 font-medium">Required Amount:</span>
            <span className="text-gray-900 font-semibold">
              <CurrencyFormatter
                amount={Number(props?.required_amount ?? 0)}
                className=""
                spanClassName=""
              />
            </span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-red-600 font-bold">Shortfall:</span>
              <span className="text-red-600 font-bold">
                <CurrencyFormatter
                  amount={Number(shortfall ?? 0)}
                  className=""
                  spanClassName=""
                />
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
      </div>
    </Modal>
  );
};

export default InsufficientBalanceModal;
