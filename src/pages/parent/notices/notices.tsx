import ErrorState from "@/components/error-state";
import { BellIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import Spinner from "@/components/spinner";
import NoRecordFound from "@/components/no-record-found";
import SectionHeader from "@/components/section-header";
import useNoticesController from "./notices-controller";

const ParentNotices = () => {
  const { t, notices, isLoading, handleMarkRead, loadError, retryLoad } = useNoticesController();

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Notices" description="School announcements and holidays relevant to you" />
      <div className="bg-white rounded-lg shadow p-6">
        {loadError ? (
          <ErrorState error={loadError} onRetry={retryLoad} />
        ) : isLoading ? (
          <Spinner />
        ) : notices.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => handleMarkRead(notice)}
                className="border-b pb-4 last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {!notice.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-600" aria-label="Unread" />}
                  {notice.type === "holiday" ? (
                    <CalendarDaysIcon className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <BellIcon className="h-5 w-5 text-primary-500 shrink-0" />
                  )}
                  <h2 className={`text-lg text-gray-900 ${notice.isRead ? "font-medium" : "font-semibold"}`}>{notice.title}</h2>
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
                    className="mt-2 inline-block text-sm text-primary-600 hover:underline"
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
