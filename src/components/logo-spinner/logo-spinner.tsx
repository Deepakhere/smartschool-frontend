import { useState, useEffect } from "react";
import logo from "../../icons/logo.png";

const LogoSpinner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="relative w-32 h-32">
        {/* Spinning border */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full border-t-indigo-600 animate-spin"></div>

        {/* Centered logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-16 h-16 transition-opacity duration-200 ${
              isLoaded ? "animate-pulse" : "opacity-0"
            }`}
          >
            <img
              src={logo}
              alt="Kidsight Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSpinner;
