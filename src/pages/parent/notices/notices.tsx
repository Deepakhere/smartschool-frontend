import { BellIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
import useNoticesController from "./notices-controller";

const ParentNotices = () => {
  const { t, notices, isLoading, handleMarkRead } = useNoticesController();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Notices</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {isLoading ? (
          <LogoSpinner offsetSidebar />
        ) : notices.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => handleMarkRead(notice.id)}
                className="border-b pb-4 last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {notice.type === "holiday" ? (
                    <CalendarDaysIcon className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <BellIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">{notice.title}</h2>
                  {notice.pinned && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pinned
                    </span>
                  )}
                </div>
                {notice.date && (
                  <p className="text-gray-600 text-sm mt-1">
                    Date: {new Date(notice.date).toLocaleDateString()}
                  </p>
                )}
                <p className="mt-2 text-gray-700">{notice.content}</p>
                {notice.attachmentURL && (
                  <a
                    href={notice.attachmentURL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                  >
                    View attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentNotices;
