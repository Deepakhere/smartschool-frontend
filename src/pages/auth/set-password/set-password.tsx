import { Link } from "react-router-dom";

import EyeON from "../../../icons/eye-on-icon";
import EyeOff from "../../../icons/eye-off";
import ButtonSpinner from "../../../icons/button-spinner";
import useSetPasswordController from "./set-password-controller";

const SetPassword = () => {
  const {
    hasToken,
    password,
    confirmPassword,
    showPassword,
    error,
    isLoading,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    handleSubmit,
  } = useSetPasswordController();

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <img src="./kidsight.png" alt="" className="dark:invert" />
      <div className="max-w-sm w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-2 text-xl font-bold text-gray-900">Set Your Password</h2>
          <span className="text-xs text-gray-600">Choose a password to activate your account</span>
        </div>

        {!hasToken ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-600">This link is invalid or missing its token.</p>
            <Link to="/login" className="text-xs text-indigo-600">
              Return to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="space-y-6">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="shadow-sm w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New password"
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

              <div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              At least 10 characters, with a mix of uppercase, lowercase, numbers or symbols.
            </p>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading && <ButtonSpinner />}
                Set Password
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="text-xs text-gray-600">
                Return to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetPassword;
