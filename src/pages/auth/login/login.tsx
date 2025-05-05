import { Link } from "react-router-dom";

import EyeON from "../../../icons/eye-on-icon";
import EyeOff from "../../../icons/eye-off";
import useLoginController from "./login-controller";
import ButtonSpinner from "../../../icons/button-spinner";

const Login = () => {
  const {
    t,
    email,
    error,
    password,
    showPassword,
    isSigninLoading,
    setEmail,
    setPassword,
    handleSubmit,
    setShowPassword,
  } = useLoginController();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
        <img src="./kidsight.png" alt="" />
        <div className="max-w-sm w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {t("labels.welcome")}
            </h2>
            <span className="text-xs text-gray-600">
              {t("labels.sign_in_to_your_account")}
            </span>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="space-y-6">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="shadow-sm w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeON /> : <EyeOff />}
                </button>
              </div>
            </div>

            <div className="text-xs text-right text-indigo-600">
              <Link to="/forgot-password">{t("labels.forgot_password?")}</Link>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  email && password ? "" : "opacity-50 cursor-not-allowed"
                }`}
              >
                {isSigninLoading ? <ButtonSpinner /> : t("buttons.sign_in")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
