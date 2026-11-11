import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserCircleIcon,
  QuestionMarkCircleIcon,
  BuildingOffice2Icon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

import Avatar from "@/shared/ui/avatar";
import { useUserMenuController } from "../model/user-menu-controller";

// the account menu, shared by the sidebar popover and the header bottom sheet; only the container changes
const UserMenuBody = ({
  user,
  theme,
  setTheme,
  profilePath,
  supportPath,
  isPlatformAdmin,
  handleLogout,
}: Omit<ReturnType<typeof useUserMenuController>, "isCollapsed">) => {
  const { t } = useTranslation();
  if (!user?.name) return null;

  return (
    <>
      <div className="flex items-center gap-2.5 px-2 py-2">
        <Avatar name={user.name} src={user.avatar?.url} size={36} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="my-1 border-t border-gray-100" />

      <Link
        to={profilePath}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <UserCircleIcon className="h-4 w-4 text-gray-400" />
        {t("labels.your_profile")}
      </Link>

      {supportPath && (
        <Link
          to={supportPath}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
          Help and support
        </Link>
      )}

      {isPlatformAdmin && (
        <>
          <Link
            to="/organization"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <BuildingOffice2Icon className="h-4 w-4 text-gray-400" />
            Switch Organization
          </Link>
          <a
            href={import.meta.env.VITE_ADMIN_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <BuildingOffice2Icon className="h-4 w-4 text-gray-400" />
            Platform Console
          </a>
        </>
      )}

      <div className="my-1 border-t border-gray-100" />

      <div className="px-2 py-2">
        <p className="mb-1.5 text-xs font-medium text-gray-500">{t("labels.theme")}</p>
        <div className="grid grid-cols-2 gap-1 rounded-md bg-gray-100 dark:bg-gray-950 p-1">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center justify-center gap-1.5 rounded py-1.5 text-sm font-medium transition-colors ${
              theme === "light"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <SunIcon className="h-4 w-4" />
            {t("common.themes.light")}
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center justify-center gap-1.5 rounded py-1.5 text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <MoonIcon className="h-4 w-4" />
            {t("common.themes.dark")}
          </button>
        </div>
      </div>

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400" />
        {t("labels.sign_out")}
      </button>
    </>
  );
};

export default UserMenuBody;
