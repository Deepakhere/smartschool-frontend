import EmptyState from "@/shared/ui/empty-state";
import ErrorState from "@/shared/ui/error-state";
import SectionHeader from "@/shared/ui/section-header";
import Spinner from "@/shared/ui/spinner";
import ResultCard from "./components/result-card";
import useParentReportsController from "./reports-controller";

const ParentReports = () => {
  const c = useParentReportsController();

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Results" description="Published exam results and report cards for your children" />

      {c.error ? (
        <ErrorState error={c.error} onRetry={c.retry} />
      ) : c.isLoading ? (
        <Spinner />
      ) : c.hasNoResults ? (
        <div className="bg-white rounded-lg shadow p-6">
          <EmptyState title="No results yet" description="Published exam results and report cards will show up here." />
        </div>
      ) : (
        <div className="space-y-6">
          {c.children.map((item) => (
            <div key={item.studentId} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{item.studentName}</h2>
              <div className="space-y-6">
                {item.results.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    isEmailing={c.isEmailing}
                    onDownload={() => c.handleDownload(result, item.studentId)}
                    onEmail={() => c.handleEmail(result, item.studentId)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentReports;
