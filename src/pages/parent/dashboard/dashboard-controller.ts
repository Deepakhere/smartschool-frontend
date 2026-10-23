import { useParams } from "react-router-dom";
import { UserGroupIcon, BookOpenIcon, CurrencyDollarIcon, BellIcon } from "@heroicons/react/24/outline";

import { formatMoney } from "@/utils";
import useGetParentDashboard from "./service/get-parent-dashboard";

const useParentDashboardController = () => {
  const { organizationId } = useParams();
  const { data, isLoading, isError, error, refetch } = useGetParentDashboard(organizationId || "");

  const cards = [
    { title: "My Children", value: data?.childrenCount ?? "-", icon: UserGroupIcon },
    { title: "Upcoming Homework", value: data?.upcomingHomeworkCount ?? "-", icon: BookOpenIcon },
    {
      title: "Pending Fees",
      value: data ? formatMoney(data.pendingFeesTotal) : "-",
      icon: CurrencyDollarIcon,
    },
    { title: "Active Notices", value: data?.recentNoticesCount ?? "-", icon: BellIcon },
  ];

  return {
    cards,
    isLoading,
    error: isError ? error : null,
    retry: () => refetch(),
    hasNoChildren: !!data && data.childrenCount === 0,
  };
};

export default useParentDashboardController;
