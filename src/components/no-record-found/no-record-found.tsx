import { TFunction } from "i18next";
import NoRecordIcon from "../../icons/no-record-icon";

const NoRecordFound = ({
  t,
  searchTerm,
  clearFilters,
}: {
  t: TFunction<"translation", undefined>;
  searchTerm: string;
  clearFilters: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <NoRecordIcon />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {t("labels.no_records_found")}
      </h3>
      <p className="text-xs text-gray-500 mb-6 text-center max-w-md">
        {searchTerm
          ? t("messages.no_search_term_found", { entity: `${searchTerm}` })
          : t("messages.no_record_found")}
      </p>
      <button
        onClick={clearFilters}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {t("labels.clear_filters")}
      </button>
    </div>
  );
};

export default NoRecordFound;
