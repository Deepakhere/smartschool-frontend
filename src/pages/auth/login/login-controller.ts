import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../../context/auth-context";
import { useSingIn } from "../service";

const useLoginController = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error, setError] = useState("");

  const signIn = useSingIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    signIn.mutate({ email, password });
  };

  useEffect(() => {
    if (signIn.isSuccess && signIn.data) {
      login(signIn.data?.token, signIn.data?.role);
      navigate(`/${signIn.data.role}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signIn.data, signIn.isSuccess]);

  return {
    t,
    email,
    error,
    password,
    showPassword,
    isSigninLoading: signIn.isLoading,
    setShowPassword,
    setEmail,
    setPassword,
    handleSubmit,
  };
};

export default useLoginController;
