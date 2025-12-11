import { showToast } from "@/components/tools/toast";
import { OVERVIEW } from "@/data/routes/routes";
import { useLoginMutation } from "@/store/services/auth.service";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "@/store/services/configs/environment.config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  // Hook implementation goes here
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input Change Event:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [login, { isLoading, isSuccess, isError, data, error }] =
    useLoginMutation();

  const handleLogin = async () => {
    try {
      const newErrors: Record<string, string | null> = {};

      if (!formData.username) {
        newErrors.username = "Username is required";
      }

      // Validate password
      // const passwordError = Validators.validatePassword(formData.password);
      // if (passwordError) {
      //   newErrors.password = passwordError;
      // }

      if (!formData.password) {
        newErrors.password = "Password is required";
      }

      setErrors(newErrors);
      if (Object.values(newErrors).some((error) => error)) {
        return;
      }

      await login({
        username: formData.username,
        password: formData.password,
        clientId: Number(
          getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID) ?? 0
        ),
      }).unwrap();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error?.message ||
        "Network error. Please check your connection.";
      showToast({
        type: "error",
        title: "Login Failed",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.success) {
        showToast({
          type: "success",
          title: "Welcome back!",
          description: `Good to see you, ${data?.data?.username}`,
        });
        navigate(OVERVIEW.SPORTS);
      } else {
        showToast({
          type: "error",
          title: "Login Failed",
          description: data?.error,
        });
      }
    }
    if (isError) {
      showToast({
        type: "error",
        title: "Login Failed",
        description: "Invalid username or password",
      });
    }
  }, [isSuccess, isError, isLoading]);

  return { formData, errors, isLoading, handleInputChange, handleLogin };
};
