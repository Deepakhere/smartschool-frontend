import { useState, useEffect } from "react";
import logo from "../../icons/logo.png";

interface LogoSpinnerProps {
  // true when rendered inside the admin layout, so it centers in the
  // content area to the right of the sidebar and below the header,
  // instead of the full viewport
  offsetSidebar?: boolean;
}

const LogoSpinner = ({ offsetSidebar = false }: LogoSpinnerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`fixed bottom-0 right-0 ${
        offsetSidebar ? "top-16 left-52" : "top-0 left-0"
      } flex items-center justify-center bg-white z-10`}
    >
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
