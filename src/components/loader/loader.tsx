import { useState, useEffect } from "react";
import Loader from "../../../icons/loader.png";

const GraduationCapLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-48 h-48 flex justify-center items-center">
        <div className="absolute w-40 h-40 border-4 border-transparent rounded-full border-t-blue-600 border-r-blue-600 border-b-blue-600 animate-spin"></div>

        <div
          className={`w-24 h-24 flex justify-center items-center ${
            isLoaded ? "animate-pulse" : "opacity-0"
          }`}
        >
          <img src={Loader} alt="Graduation Cap" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default GraduationCapLoader;
