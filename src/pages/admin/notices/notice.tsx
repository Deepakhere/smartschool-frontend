import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";

import NoticeModal from "../../../components/notice-modal";
import NoRecordFound from "../../../components/no-record-found";
import useNoticeController from "./notice-controller";
import Spinner from "../../../components/spinner";
import LogoSpinner from "../../../components/logo-spinner";

const AdminNotices = () => {
  const {
    t,
    notices,
    isNoticeModalOpen,
    isLoadingNoticeList,
    isFetchingNoticeList,
    isCreatingNotice,
    isSuccessNoticeCreation,
    onCancel,
    handleCreateNotice,
    handleViewAttachment,
    handleDownloadAttachment,
    onClickCreateNotice,
  } = useNoticeController();

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("labels.manage_notices")}
            </h1>
            <button
              onClick={onClickCreateNotice}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("labels.create_notice")}
            </button>
          </div>
        </div>

        {/* Notices Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">All Notices</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage all school notices
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoadingNoticeList ? (
              <LogoSpinner />
            ) : notices.length === 0 ? (
              <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {isFetchingNoticeList ? (
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notices.map((notice) => (
                        <tr key={notice.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {notice.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {notice.content}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                notice.type === "holiday"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {notice.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(notice.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {notice.attachments &&
                                notice.attachments.length > 0 && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleViewAttachment(
                                          notice.attachments![0]
                                        )
                                      }
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="View attachment"
                                    >
                                      <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDownloadAttachment(
                                          notice.attachments![0],
                                          `notice-${notice.id}`
                                        )
                                      }
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="Download attachment"
                                    >
                                      <DocumentArrowDownIcon className="h-5 w-5" />
                                    </button>
                                  </>
                                )}
                              <button
                                className="text-red-600 hover:text-red-900"
                                title="Delete notice"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <Spinner />
                  )}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <NoticeModal
        isOpen={isNoticeModalOpen}
        onCancel={onCancel}
        isLoading={isCreatingNotice}
        onSubmit={handleCreateNotice}
        isSuccessNoticeCreation={isSuccessNoticeCreation}
      />
    </>
  );
};

export default AdminNotices;
