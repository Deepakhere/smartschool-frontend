import { useParams } from "react-router-dom";

import useGetMyTeachingLoad from "@/entities/dashboard/api/get-my-teaching-load";
import { useAuth } from "@/entities/session/model/auth-context";
import { useHasModule } from "@/entities/session/model/tenant-context";
import { useGetCalendarMonth } from "@/entities/calendar/api/calendar-service";
import { localDateString } from "@/shared/lib";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useTeacherDashboardController = () => {
  const { organizationId = "" } = useParams();
  const { user } = useAuth();
  const hasModule = useHasModule();

  const teachingLoad = useGetMyTeachingLoad(organizationId);
  const today = localDateString();
  const calendar = useGetCalendarMonth(organizationId, Number(today.slice(0, 4)), Number(today.slice(5, 7)));
  const holiday = calendar.data?.entries.find((entry) => entry.type === "holiday" && entry.date === today);

  return {
    name: user?.name || "",
    isLoading: teachingLoad.isLoading,
    // a failed load shows an error with a retry, not an empty page
    loadError: teachingLoad.isError ? teachingLoad.error : null,
    retryLoad: () => teachingLoad.refetch(),
    assignments: teachingLoad.data?.assignments || [],
    todaySlots: teachingLoad.data?.todaySlots || [],
    recentNotices: teachingLoad.data?.recentNotices || [],
    todayName: DAY_NAMES[new Date().getDay()],
    holidayTitle: holiday?.title ?? "",
    showTimetable: hasModule("timetable"),
    showNotices: hasModule("notices"),
  };
};

export default useTeacherDashboardController;
