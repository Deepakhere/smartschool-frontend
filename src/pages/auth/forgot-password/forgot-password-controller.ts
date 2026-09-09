import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { useForgotPassword } from "../service";
import useError from "@/hooks/error/error";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "./forgot-password.schema";

const useForgotPasswordController = () => {
  const { t } = useTranslation();

  const [captchaToken, setCaptchaToken] = useState<string | null>("");
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotPassword = useForgotPassword();

  useError({
    mutation: forgotPassword,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!captchaToken) {
      setError(t("messages.invalid_captcha"));
      return;
    }

    try {
      await forgotPassword.mutateAsync({
        email: values.email,
        captcha_token: captchaToken,
      });
    } catch (submitError) {
      console.log(submitError);
    }
  });

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
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPassword.isSuccess]);

  useEffect(() => {
    if (forgotPassword.isError) {
      recaptchaRef.current?.reset();
      const errorResponse = forgotPassword.error?.response?.Error;

      if (errorResponse?.code === "EX-00108" || errorResponse?.code === "EX-00166") {
        setDisplayError(true);
        setError(errorResponse.message);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPassword.isError, forgotPassword.error]);

  return {
    t,
    form,
    email: form.watch("email"),
    error,
    isCaptchaLoaded,
    recaptchaRef,
    displayError,
    captchaToken,
    isLoading: forgotPassword.isPending,
    isRequestCompleted: forgotPassword.isSuccess,
    onCaptchaLoaded,
    onSubmit,
  };
};

export default useForgotPasswordController;
