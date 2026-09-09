import { useTranslation } from "react-i18next";
import { BellIcon } from "@heroicons/react/24/outline";

import { useNotifications } from "@/context/notification-context";
import NotificationSheet from "./notification-sheet";

interface NotificationBellProps {
  isCollapsed: boolean;
}

const NotificationBell = ({ isCollapsed }: NotificationBellProps) => {
  const { t } = useTranslation();
  const { unreadCount, openSheet } = useNotifications();

  return (
    <div className="px-2 pt-2">
      <button
        type="button"
        onClick={openSheet}
        title={isCollapsed ? t("labels.notifications") : undefined}
        className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
      >
        <span className="relative flex-shrink-0">
          <BellIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
            isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[10rem] opacity-100 ml-3"
          }`}
        >
          {t("labels.notifications")}
        </span>
      </button>

      <NotificationSheet />
    </div>
  );
};

export default NotificationBell;
