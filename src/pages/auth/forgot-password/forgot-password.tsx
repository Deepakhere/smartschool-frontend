import React from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import { GOOGLE_CAPTCHA_KEY } from "../../../utils";
import useForgotPasswordController from "./forgot-password-controller";
import ForgotPasswordEmail from "./success/forgot-password-email";

const ForgotPassword: React.FC = () => {
  const {
    t,
    email,
    isRequestCompleted,
    isLoading,
    isCaptchaLoaded,
    recaptchaRef,
    displayError,
    error,
    emailError,
    captchaToken,
    handleSubmit,
    handleEmailChange,
    handleEmailBlur,
    onCaptchaLoaded,
  } = useForgotPasswordController();

  if (isRequestCompleted) {
    return <ForgotPasswordEmail email={email} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <img src="./kidsight.png" alt="" />
      <div className="max-w-sm w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {t("labels.forgot_password")}
          </h2>
          <span className="mt-2 block text-xs text-gray-600">
            {t("messages.enter_email_associate_with_account")}
          </span>
        </div>

        {displayError && error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs text-gray-600">
              {t("labels.will_inform_you")}
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`appearance-none block w-full px-3 py-2 border ${
                  emailError ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder={t("labels.forgot_email_placeholder")}
              />
              {emailError && (
                <p className="mt-2 text-xs text-red-600">{emailError}</p>
              )}
            </div>
          </div>

          {isCaptchaLoaded && (
            <div className="flex justify-start">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={GOOGLE_CAPTCHA_KEY}
                onChange={onCaptchaLoaded}
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                captchaToken === "" || captchaToken === null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? t("buttons.sending") : t("buttons.reset_password")}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-xs text-gray-600">
              {t("links.return_to_login")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
