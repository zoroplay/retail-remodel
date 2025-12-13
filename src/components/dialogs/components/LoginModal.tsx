import React, { useCallback } from "react";
import { Loader, LogIn, LogOut, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import Modal from "../Modal";
import { getClientTheme } from "@/config/theme.config";
import { useLogin } from "@/hooks/useLogin";
import Input from "@/components/inputs/Input";
const { classes } = getClientTheme();

type Props = {
  onClose: () => void;
};

const LoginModal = ({ onClose }: Props) => {
  const { handleLogin, handleInputChange, formData, errors, isLoading } =
    useLogin();

  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="max-w-[425px] !w-[425px] py-2 backdrop-blur-xl border"
      footer={
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            type="button"
            className={`flex-1 h-9 ${classes["button-proceed-bg"]} border ${classes["button-proceed-hover"]} ${classes["button-proceed-border"]} ${classes["button-proceed-text"]} rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all  disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <>
              <LogOut size={16} />
              {isLoading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Login"
              )}
            </>
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 items-center">
          {/* <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <LogIn size={32} className="text-emerald-400" />
          </div> */}
          <div
            className={`font-semibold ${classes["text-primary"]} text-lg flex justify-start w-full p-2`}
          >
            <h1>Login to Your Account</h1>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Input
              type="tel"
              name="username"
              value={formData.username}
              onChange={(e) => handleInputChange(e)}
              placeholder="Mobile Number"
              error={errors.username}
            />
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              placeholder="Password"
              error={errors.password}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
