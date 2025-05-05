import React, { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { useForgotPassword } from "../service";
import useError from "../../../hooks/error/error";
import { EMAIL_REGEX_PATTERN } from "../../../utils";

const useForgotPasswordController = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>("");
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const forgotPassword = useForgotPassword();

  useError({
    mutation: forgotPassword,
  });

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError(t("messages.email_required"));
      return false;
    }
    if (!EMAIL_REGEX_PATTERN.test(email)) {
      setEmailError(t("messages.email_invalid"));
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      validateEmail(e.target.value);
    }
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    if (!captchaToken) {
      setError(t("messages.invalid_captcha"));
      return;
    }

    try {
      await forgotPassword.mutateAsync({
        email,
        captcha_token: captchaToken,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsCaptchaLoaded(true);
  }, []);

  const onCaptchaLoaded = (value: string | null) => {
    setCaptchaToken(value);
    setError(null);
  };

  useEffect(() => {
    if (forgotPassword.isSuccess) {
      setCaptchaToken("");
      setEmail("");
      setEmailError("");
    }
  }, [forgotPassword.isSuccess]);

  useEffect(() => {
    if (forgotPassword.isError) {
      recaptchaRef.current?.reset();
      const errorResponse = forgotPassword.error?.response?.Error;

      if (
        errorResponse?.code === "EX-00108" ||
        errorResponse?.code === "EX-00166"
      ) {
        setDisplayError(true);
        setError(errorResponse.message);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPassword.isError, forgotPassword.error]);

  return {
    t,
    email,
    emailError,
    error,
    isCaptchaLoaded,
    recaptchaRef,
    displayError,
    captchaToken,
    isLoading: forgotPassword.isLoading,
    isRequestCompleted: forgotPassword.isSuccess,
    onCaptchaLoaded,
    handleSubmit,
    handleEmailChange,
    handleEmailBlur,
  };
};

export default useForgotPasswordController;
