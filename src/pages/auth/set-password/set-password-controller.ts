import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useSetUserPassword } from "../service";

const useSetPasswordController = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const setUserPassword = useSetUserPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 10) {
      setError("Password must be at least 10 characters long.");
      return;
    }

    setUserPassword.mutate(
      { token, password },
      {
        onSuccess: () => {
          toast.success("Password set successfully. You can now sign in.");
          navigate("/login");
        },
        onError: (err) => {
          setError(err?.response?.Error?.message || "Something went wrong. Please try again.");
        },
      }
    );
  };

  return {
    t,
    hasToken: !!token,
    password,
    confirmPassword,
    showPassword,
    error,
    isLoading: setUserPassword.isLoading,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    handleSubmit,
  };
};

export default useSetPasswordController;
