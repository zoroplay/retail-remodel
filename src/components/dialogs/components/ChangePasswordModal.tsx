import React, { useState } from "react";
import { Shield, X } from "lucide-react";
import Input from "../../inputs/Input";
import { toast } from "sonner";
import Modal from "../Modal";
import { getClientTheme } from "@/config/theme.config";

interface ChangePasswordForm {
  oldPassword: string;
  password: string;
  confPassword: string;
}

type Props = {
  onClose: () => void;
};

const ChangePasswordModal = ({ onClose }: Props) => {
  const { classes } = getClientTheme();
  const modalClasses = classes.modal.change_password;

  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    password: "",
    confPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordForm.oldPassword || passwordForm.oldPassword.length < 3) {
      toast.error("Enter your old password (min 3 characters)");
      return;
    }

    if (!passwordForm.password || passwordForm.password.length < 3) {
      toast.error("Enter a new password (min 3 characters)");
      return;
    }

    if (passwordForm.password !== passwordForm.confPassword) {
      toast.error("Passwords must match");
      return;
    }

    setIsLoading(true);

    // TODO: Replace with actual API call
    // changePassword(passwordForm).then(res => {
    //   if (res.success) {
    //     toast.success("Password changed successfully");
    //     onClose();
    //     // Redirect to login
    //   }
    // })

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password changed successfully. Please login again.");
      onClose();
      setPasswordForm({ oldPassword: "", password: "", confPassword: "" });
    }, 1500);
  };

  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={`max-w-md !w-full backdrop-blur-xl  shadow-md ${modalClasses["modal-shadow"]}`}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-2 ${modalClasses["cancel-button-bg"]} ${modalClasses["cancel-button-hover"]} ${modalClasses["cancel-button-text"]} text-sm font-medium rounded-lg transition-all`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 px-4 py-2 ${modalClasses["confirm-button-bg"]} ${modalClasses["confirm-button-hover"]} ${modalClasses["confirm-button-text"]} text-sm font-medium rounded-lg transition-all shadow-lg ${modalClasses["confirm-button-shadow"]} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      }
    >
      <div className={`flex flex-col ${classes["text-primary"]}`}>
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-2 border-b ${modalClasses["header-border"]}`}
        >
          <h3
            className={`text-lg font-bold ${modalClasses["header-title"]} flex items-center gap-2`}
          >
            <Shield size={20} className={modalClasses["header-icon"]} />
            Change Password
          </h3>
          <button
            onClick={onClose}
            className={`${modalClasses["close-button"]} ${modalClasses["close-button-hover"]} transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handlePasswordSubmit} className="pt-2">
          <div
            className={`${modalClasses["info-box-bg"]} border ${modalClasses["info-box-border"]} rounded-lg p-2 mb-4`}
          >
            <p className={`text-xs ${modalClasses["info-box-text"]}`}>
              Please enter a different new password from the previous one. Your
              password must be at least 3 characters long.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              label="Current Password"
              name="oldPassword"
              type="password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              required
              height="h-[44px]"
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              text_color={classes["input-text"]}
              password
            />

            <Input
              label="New Password"
              name="password"
              type="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
              height="h-[44px]"
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              text_color={classes["input-text"]}
              password
            />

            <Input
              label="Confirm New Password"
              name="confPassword"
              type="password"
              value={passwordForm.confPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              required
              height="h-[44px]"
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              text_color={classes["input-text"]}
              password
            />
          </div>

          {/* Modal Footer */}
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
