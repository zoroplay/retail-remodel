import React, { useCallback } from "react";
import { Loader, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import Modal from "../Modal";
import { logoutUser } from "@/store/features/slice/user.slice";
import { getClientTheme } from "@/config/theme.config";
const { classes } = getClientTheme();

type Props = {
  onClose: () => void;
};

const LogoutModal = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    onClose();
    // dispatch(clearBets());
    // onClose();
    // router.push("/auth/sign-in");
  }, [dispatch]);

  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="max-w-[425px] !w-[425px] py-2 backdrop-blur-xl border"
      footer={
        <div className="flex items-center justify-center gap-1 w-full">
          <button
            type="button"
            onClick={onClose}
            // disabled={isLoading}
            className={`flex-1  ${classes["button-secondary-bg"]} ${classes["button-secondary-hover"]} ${classes["button-secondary-border"]} ${classes["button-secondary-text"]} rounded-r-none rounded-md h-9 py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleLogout}
            // disabled={isLoading}
            type="button"
            className={`flex-1 ${classes["button-cancel-bg"]} ${classes["button-cancel-hover"]} ${classes["button-cancel-border"]} ${classes["button-cancel-text"]} rounded-l-none rounded-md h-9 py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-all  disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Logging out...
              </>
            ) : ( */}
            <>
              <LogOut size={16} />
              Logout
            </>
            {/* )} */}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-2 items-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <LogOut size={24} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-center">Confirm Logout</h2>
          <p className={`text-sm ${classes["text-secondary"]} text-center`}>
            Are you sure you want to logout from your account?
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
