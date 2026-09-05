import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
import useParentFeesController from "./fees-controller";

const formatMoney = (paise: number) => `${(paise / 100).toFixed(2)}`;

const ParentFees = () => {
  const { t, fees, isLoading } = useParentFeesController();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Fees</h1>

      {isLoading ? (
        <LogoSpinner offsetSidebar />
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        </div>
      ) : (
        <div className="space-y-6">
          {fees.map((fee) => (
            <div key={fee.studentFeeId} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{fee.studentName}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    fee.totalBalance > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {fee.totalBalance > 0 ? `Due: ${formatMoney(fee.totalBalance)}` : "Fully paid"}
                </span>
              </div>

              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2">Installment</th>
                    <th className="pb-2">Due date</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Paid</th>
                    <th className="pb-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {fee.installments.map((i) => (
                    <tr key={i.label} className="border-t">
                      <td className="py-2 text-gray-900">{i.label}</td>
                      <td className="py-2 text-gray-500">{new Date(i.dueDate).toLocaleDateString()}</td>
                      <td className="py-2 text-gray-900">{formatMoney(i.netAmount)}</td>
                      <td className="py-2 text-gray-900">{formatMoney(i.paidAmount)}</td>
                      <td className="py-2 text-gray-900">{formatMoney(i.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {fee.payments.filter((p) => p.entryType === "payment").length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment history</p>
                  {fee.payments
                    .filter((p) => p.entryType === "payment")
                    .map((p) => (
                      <div key={p.id} className="flex justify-between text-sm border-t py-2 text-gray-700">
                        <span>{p.receiptNumber}</span>
                        <span>{formatMoney(p.amount)}</span>
                        <span className="text-gray-500">{p.method}</span>
                        <span className="text-gray-500">{new Date(p.paidAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentFees;
