import { useTranslation } from "react-i18next";

interface PagerProps {
  page: number;
  pageSize: number;
  // the server's total count for the whole list, not the rows on this page
  total: number;
  onPageChange: (page: number) => void;
}

// page numbers to show: always the first and last, and the pages around the current one
const visiblePages = (page: number, pageCount: number): (number | "gap")[] => {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (["gap", p] as const) : [p]));
};

const Pager = ({ page, pageSize, total, onPageChange }: PagerProps) => {
  const { t } = useTranslation();
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const arrow = "relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent";

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <p className="text-sm text-gray-700">
        {t("labels.showing")} <span className="font-medium">{first}</span> {t("labels.to")} <span className="font-medium">{last}</span>{" "}
        {t("labels.of")} <span className="font-medium">{total}</span> {t("labels.results")}
      </p>
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className={`${arrow} rounded-l-md`}>
          <span className="sr-only">{t("labels.previous")}</span>‹
        </button>
        {visiblePages(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="relative inline-flex items-center px-3 py-2 text-sm text-gray-500 ring-1 ring-inset ring-gray-300">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                p === page ? "bg-primary-600 text-white" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === pageCount} className={`${arrow} rounded-r-md`}>
          <span className="sr-only">{t("labels.next")}</span>›
        </button>
      </nav>
    </div>
  );
};

export default Pager;
