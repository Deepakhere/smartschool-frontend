import { useLocation } from "react-router-dom";

const useStudentsController = () => {
  const location = useLocation();
  const path = location.pathname;

  return {
    path,
  };
};

export default useStudentsController;
