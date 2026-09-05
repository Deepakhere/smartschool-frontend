import { useParams } from "react-router-dom";

import useGetMyTeachingLoad from "./service/get-my-teaching-load";
import { useAuth } from "../../../context/auth-context";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useTeacherDashboardController = () => {
  const { organizationId = "" } = useParams();
  const { user } = useAuth();

  const teachingLoad = useGetMyTeachingLoad(organizationId);

  return {
    name: user?.name || "",
    isLoading: teachingLoad.isLoading,
    assignments: teachingLoad.data?.assignments || [],
    todaySlots: teachingLoad.data?.todaySlots || [],
    recentNotices: teachingLoad.data?.recentNotices || [],
    todayName: DAY_NAMES[new Date().getDay()],
  };
};

export default useTeacherDashboardController;
