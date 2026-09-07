import { useParams } from "react-router-dom";
import {
  UserGroupIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

import SectionHeader from "../../../components/section-header";
import Spinner from "../../../components/spinner";
import useGetParentDashboard from "./service/get-parent-dashboard";

const formatMoney = (paise: number) => `${(paise / 100).toFixed(2)}`;

const ParentDashboard = () => {
  const { organizationId } = useParams();
  const { data, isLoading } = useGetParentDashboard(organizationId || "");

  const cards = [
    { title: "My Children", value: data?.childrenCount ?? "—", icon: UserGroupIcon },
    { title: "Upcoming Homework", value: data?.upcomingHomeworkCount ?? "—", icon: BookOpenIcon },
    {
      title: "Pending Fees",
      value: data ? formatMoney(data.pendingFeesTotal) : "—",
      icon: CurrencyDollarIcon,
    },
    { title: "Active Notices", value: data?.recentNoticesCount ?? "—", icon: BellIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Dashboard" description="A quick overview of your child's school activity" />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 flex items-center space-x-4"
              >
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
