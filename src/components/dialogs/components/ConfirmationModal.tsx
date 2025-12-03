"use client";
import React, { useState } from "react";
import { Loader } from "lucide-react";

import Modal from "../Modal";
import { useModal } from "@/hooks/useModal";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { MODAL_FUNCTION_ENUM } from "@/store/features/types";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  onClose: () => void;
};

const ConfirmationModal = ({ onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { title, modal_function, description } = useAppSelector(
    (state) => state.modal
  );
  const { classes } = getClientTheme();
  const modalClasses = classes.modal;
  const { openModal } = useModal();
  const handleProceed = () => {
    setIsLoading(true);
    switch (modal_function) {
      case MODAL_FUNCTION_ENUM.CANCEL_TICKET:
        console.log("NA HERE");
        break;
      default:
        // Default action
        onClose();
        break;
    }
  };

  // Header JSX
  const header = (
    <div className="flex flex-col gap-4 relative">
      <h2 className="text-center text-xl font-bold">
        {title || "Are you sure?"}
      </h2>
    </div>
  );

  // Footer JSX
  const footer = (
    <div className="flex items-center justify-end gap-4 w-full">
      <button
        type="button"
        onClick={onClose}
        className={`cursor-pointer rounded-lg h-9 border p-2 px-4 flex items-center justify-center gap-2 text-xs ${classes["button-cancel-bg"]} ${classes["button-cancel-hover"]} ${classes["button-cancel-border"]} ${classes["button-cancel-text"]} `}
      >
        Cancel
      </button>
      <button
        onClick={() => {
          handleProceed();
        }}
        disabled={isLoading}
        type="button"
        className={`cursor-pointer rounded-lg h-9 border p-2 px-4 flex items-center justify-center gap-2 text-xs ${classes["button-proceed-bg"]} ${classes["button-proceed-hover"]} ${classes["button-proceed-border"]} ${classes["button-proceed-text"]} disabled:opacity-50`}
      >
        {isLoading ? <Loader className="animate-spin" /> : "Proceed"}
      </button>
    </div>
  );

  return (
    <Modal
      open={true}
      onOpenChange={onClose}
      header={header}
      footer={footer}
      className={`sm:max-w-[400px] max-w-[90vw]
      `}
    >
      <div className={`text-sm text-center`}>
        {description || "Do you really want to proceed with this action?"}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
