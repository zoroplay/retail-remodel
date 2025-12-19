import React, { useState } from "react";
import { Shield, X } from "lucide-react";
import Input from "../../inputs/Input";
import { toast } from "sonner";
import Modal from "../Modal";
import { getClientTheme } from "@/config/theme.config";
import { useChangeUserPasswordMutation } from "@/store/services/user.service";
import { showToast } from "@/components/tools/toast";
import environmentConfig from "@/store/services/configs/environment.config";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const searchParams = new URLSearchParams(window.location.search);
  const [ref, _] = useState<string | null>(searchParams.get("ref"));

  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    password: "",
    confPassword: "",
  });

  const [changeUserPassword, { isLoading }] = useChangeUserPasswordMutation();

  const handlePasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !ref &&
      (!passwordForm.oldPassword || passwordForm.oldPassword.length < 3)
    ) {
      setErrors({
        ...errors,
        oldPassword: "Enter your old password (min 3 characters)",
      });
      console.log("oldPassword here");
      return;
    }

    if (!passwordForm.password || passwordForm.password.length < 3) {
      setErrors((prev) => ({
        ...prev,
        password: "Enter a new password (min 3 characters)",
      }));
      console.log("password here");
      return;
    }

    if (passwordForm.password !== passwordForm.confPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "Passwords must match",
        confPassword: "Passwords must match",
      }));
      console.log("confPassword here");
      //

      return;
    }

    // TODO: Replace with actual API call
    const response = await changeUserPassword({
      clientId: environmentConfig.CLIENT_ID,
      password: passwordForm.password,
      username: ref ?? "",
    }).unwrap();

    if (response.success) {
      showToast({
        type: "success",
        title: "Password changed successfully. Please login again.",
      });
      onClose();
      setPasswordForm({ oldPassword: "", password: "", confPassword: "" });
    }
  };

  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={`max-w-md !w-full backdrop-blur-xl  shadow-md `}
      footer={
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-2 ${classes["button-secondary-bg"]} ${classes["button-secondary-border"]} ${classes["button-secondary-hover"]} ${classes["button-secondary-text"]} shadow-sm text-[11px] font-medium rounded-md transition-all rounded-r-none`}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="change-password-form"
            disabled={isLoading}
            className={`flex-1 px-4 py-2 ${classes["button-primary-bg"]} ${classes["button-primary-border"]} ${classes["button-primary-hover"]} ${classes["button-primary-text"]} shadow text-[11px] font-medium rounded-md transition-all rounded-l-none disabled:opacity-50 disabled:cursor-not-allowed`}
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
        <form
          id="change-password-form"
          onSubmit={handlePasswordSubmit}
          className="pt-2"
        >
          <div
            className={`${modalClasses["info-box-bg"]} border ${modalClasses["info-box-border"]} rounded-lg p-2 mb-4`}
          >
            <p className={`text-xs ${modalClasses["info-box-text"]}`}>
              Please enter a different new password from the previous one. Your
              password must be at least 3 characters long.
            </p>
          </div>

          <div className="space-y-3">
            {!ref && (
              <Input
                label="Current Password"
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
                bg_color={classes["input-bg"]}
                border_color={classes["input-border"]}
                text_color={classes["input-text"]}
                password
                error={errors?.oldPassword}
              />
            )}

            <Input
              label="New Password"
              name="password"
              type="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              text_color={classes["input-text"]}
              password
              error={errors?.password}
            />

            <Input
              label="Confirm New Password"
              name="confPassword"
              type="password"
              value={passwordForm.confPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              required
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              text_color={classes["input-text"]}
              password
              error={errors?.confPassword}
            />
          </div>

          {/* Modal Footer */}
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
