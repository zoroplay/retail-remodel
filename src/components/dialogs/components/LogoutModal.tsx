import React, { useCallback } from "react";
import { Loader, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import Modal from "../Modal";
import { logoutUser } from "@/store/features/slice/user.slice";

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
      className="max-w-[425px] !w-[425px] py-2 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border border-slate-700/50 text-gray-100 shadow-2xl shadow-black/50"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 items-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <LogOut size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-center">Confirm Logout</h2>
          <p className="text-sm text-gray-400 text-center">
            Are you sure you want to logout from your account?
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            // disabled={isLoading}
            className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleLogout}
            // disabled={isLoading}
            type="button"
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </Modal>
  );
};

export default LogoutModal;
