"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import Modal from "../Modal";
import { useAppSelector } from "@/hooks/useAppDispatch";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import { getClientTheme } from "@/config/theme.config";
const { classes } = getClientTheme();
interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  const { title, props, description } = useAppSelector((state) => state.modal);

  return (
    <Modal
      open={true}
      onOpenChange={(_open) => {
        if (!_open) onClose();
      }}
      className={`overflow-hidden max-w-[90vw] !w-[500px]  rounded-2xl backdrop-blur-xl border border-slate-700/50 ${classes["text-primary"]} shadow-2xl shadow-black/50
           `}
      footer={
        <button
          onClick={onClose}
          className={`w-full ${classes["button-proceed-bg"]} ${classes["button-proceed-hover"]} ${classes["button-proceed-border"]} ${classes["button-proceed-text"]}  text-sm font-semibold py-2 rounded-md  transition`}
        >
          Continue
        </button>
      }
      header={
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h2 className="text-xl font-bold flex-1">{title}</h2>
        </div>
      }
    >
      <div
        className={`flex flex-col items-start justify-center text-sm ${classes["text-primary"]}`}
      >
        <p className={`leading-relaxed ${classes["text-secondary"]}`}>
          {description}
        </p>
        {props?.stake && (
          <div className="flex justify-start items-center gap-1 text-xs">
            <span>Stake:</span>
            <CurrencyFormatter
              amount={props.stake}
              className=""
              spanClassName=""
            />
          </div>
        )}
        {props?.potential_winnings && (
          <div className="flex justify-start items-center gap-1 text-xs">
            <span>Potential Winnings:</span>
            <CurrencyFormatter
              amount={props.potential_winnings}
              className=""
              spanClassName=""
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SuccessModal;
