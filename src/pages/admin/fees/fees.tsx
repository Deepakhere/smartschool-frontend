import useFeesController from "./fees-controller";

const inputClass =
  "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm";

const formatMoney = (paise: number) => `${(paise / 100).toFixed(2)}`;

const tabs: { key: "heads" | "structures" | "students" | "ledger"; label: string }[] = [
  { key: "structures", label: "Fee Structures" },
  { key: "heads", label: "Fee Heads" },
  { key: "students", label: "Student Fees & Payments" },
  { key: "ledger", label: "Payment Ledger" },
];

const AdminFees = () => {
  const {
    activeTab,
    setActiveTab,
    feeHeads,
    headForm,
    handleHeadFormChange,
    handleCreateFeeHead,
    isCreatingHead,
    feeStructures,
    classOptions,
    sectionOptions,
    classIds,
    sectionIds,
    toggleClass,
    toggleSection,
    items,
    addItemRow,
    updateItemRow,
    removeItemRow,
    installments,
    addInstallmentRow,
    updateInstallmentRow,
    removeInstallmentRow,
    structureName,
    setStructureName,
    itemsTotal,
    installmentsTotal,
    handleCreateFeeStructure,
    isCreatingStructure,
    handleAssignStructure,
    isAssigning,
    studentSearch,
    setStudentSearch,
    studentSearchResults,
    selectedStudentId,
    setSelectedStudentId,
    studentFeeSummaries,
    paymentForm,
    handlePaymentFormChange,
    handleRecordPayment,
    isRecordingPayment,
    paymentLedger,
    handleReversePayment,
  } = useFeesController();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Fees</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === tab.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "heads" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create Fee Head</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              className={inputClass}
              placeholder="Name"
              value={headForm.name}
              onChange={(e) => handleHeadFormChange("name", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Code (e.g. TUI)"
              value={headForm.code}
              onChange={(e) => handleHeadFormChange("code", e.target.value)}
            />
            <select
              className={inputClass}
              value={headForm.category}
              onChange={(e) => handleHeadFormChange("category", e.target.value)}
            >
              <option value="tuition">Tuition</option>
              <option value="transport">Transport</option>
              <option value="hostel">Hostel</option>
              <option value="exam">Exam</option>
              <option value="misc">Misc</option>
            </select>
            <button
              onClick={handleCreateFeeHead}
              disabled={isCreatingHead}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 mt-1"
            >
              Add
            </button>
          </div>

          <div className="mt-6 divide-y divide-gray-200">
            {feeHeads.map((h) => (
              <div key={h.id} className="py-2 flex justify-between text-sm">
                <span className="text-gray-900">{h.name}</span>
                <span className="text-gray-500">
                  {h.code} · {h.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "structures" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create Fee Structure</h2>
            <input
              className={inputClass}
              placeholder="Structure name (e.g. Class 9 Annual Fee)"
              value={structureName}
              onChange={(e) => setStructureName(e.target.value)}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
              <div className="flex flex-wrap gap-2">
                {classOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleClass(c.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      classIds.includes(c.id) ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sections (optional, narrows classes above)</label>
              <div className="flex flex-wrap gap-2">
                {sectionOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSection(s.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      sectionIds.includes(s.id) ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Fee head items (amounts in your currency)</label>
                <button type="button" onClick={addItemRow} className="text-xs text-indigo-600">
                  + Add item
                </button>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                  <select
                    className={inputClass}
                    value={item.feeHeadId}
                    onChange={(e) => updateItemRow(idx, "feeHeadId", e.target.value)}
                  >
                    <option value="">Fee head</option>
                    {feeHeads.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => updateItemRow(idx, "amount", e.target.value)}
                  />
                  <button type="button" onClick={() => removeItemRow(idx)} className="text-sm text-red-600">
                    Remove
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-500">Total: {itemsTotal}</p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Installments</label>
                <button type="button" onClick={addInstallmentRow} className="text-xs text-indigo-600">
                  + Add installment
                </button>
              </div>
              {installments.map((inst, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    className={inputClass}
                    placeholder="Label"
                    value={inst.label}
                    onChange={(e) => updateInstallmentRow(idx, "label", e.target.value)}
                  />
                  <input
                    type="date"
                    className={inputClass}
                    value={inst.dueDate}
                    onChange={(e) => updateInstallmentRow(idx, "dueDate", e.target.value)}
                  />
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="Amount"
                    value={inst.amount}
                    onChange={(e) => updateInstallmentRow(idx, "amount", e.target.value)}
                  />
                  <button type="button" onClick={() => removeInstallmentRow(idx)} className="text-sm text-red-600">
                    Remove
                  </button>
                </div>
              ))}
              <p className={`text-xs ${itemsTotal === installmentsTotal ? "text-gray-500" : "text-red-600"}`}>
                Total: {installmentsTotal} {itemsTotal !== installmentsTotal && "(must match items total)"}
              </p>
            </div>

            <button
              onClick={handleCreateFeeStructure}
              disabled={isCreatingStructure}
              className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Create structure
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Existing structures</h2>
            <div className="divide-y divide-gray-200">
              {feeStructures.map((s) => (
                <div key={s.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.classIds.map((c) => c.name).join(", ")} · {s.installments.length} installment(s)
                    </p>
                  </div>
                  <button
                    onClick={() => handleAssignStructure(s.id)}
                    disabled={isAssigning}
                    className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                  >
                    Assign to students
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Find a student</h2>
            <input
              className={inputClass}
              placeholder="Search by name or admission number"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {studentSearchResults.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    selectedStudentId === s.id ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {studentFeeSummaries.map((summary) => (
            <div key={summary.studentFeeId} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Balance: {formatMoney(summary.totalBalance)} of {formatMoney(summary.totalNet)}
                </h3>
              </div>
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2">Installment</th>
                    <th className="pb-2">Due</th>
                    <th className="pb-2">Net</th>
                    <th className="pb-2">Paid</th>
                    <th className="pb-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.installments.map((i) => (
                    <tr key={i.label} className="border-t">
                      <td className="py-2">{i.label}</td>
                      <td className="py-2">{new Date(i.dueDate).toLocaleDateString()}</td>
                      <td className="py-2">{formatMoney(i.netAmount)}</td>
                      <td className="py-2">{formatMoney(i.paidAmount)}</td>
                      <td className="py-2">{formatMoney(i.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Record a payment</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="Amount"
                    value={paymentForm.studentFeeId === summary.studentFeeId ? paymentForm.amount : ""}
                    onChange={(e) => {
                      handlePaymentFormChange("studentFeeId", summary.studentFeeId);
                      handlePaymentFormChange("amount", e.target.value);
                    }}
                  />
                  <select
                    className={inputClass}
                    value={paymentForm.studentFeeId === summary.studentFeeId ? paymentForm.method : "cash"}
                    onChange={(e) => {
                      handlePaymentFormChange("studentFeeId", summary.studentFeeId);
                      handlePaymentFormChange("method", e.target.value);
                    }}
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank_transfer">Bank transfer</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                  <input
                    className={inputClass}
                    placeholder="Reference (cheque no. / UTR)"
                    value={paymentForm.studentFeeId === summary.studentFeeId ? paymentForm.instrumentRef : ""}
                    onChange={(e) => {
                      handlePaymentFormChange("studentFeeId", summary.studentFeeId);
                      handlePaymentFormChange("instrumentRef", e.target.value);
                    }}
                  />
                  <button
                    onClick={handleRecordPayment}
                    disabled={isRecordingPayment}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Record
                  </button>
                </div>
              </div>

              {summary.payments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment history</p>
                  {summary.payments.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm border-t py-2">
                      <span>
                        {p.receiptNumber} · {p.entryType === "reversal" ? "Reversal" : "Payment"} · {formatMoney(p.amount)} ·{" "}
                        {p.method}
                      </span>
                      {p.entryType === "payment" && (
                        <button onClick={() => handleReversePayment(p.id)} className="text-red-600 hover:text-red-800">
                          Reverse
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "ledger" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Ledger</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2">Receipt</th>
                <th className="pb-2">Student</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentLedger.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.receiptNumber}</td>
                  <td className="py-2">{typeof p.studentId === "object" ? p.studentId.name : ""}</td>
                  <td className="py-2">{p.entryType}</td>
                  <td className="py-2">{formatMoney(p.amount)}</td>
                  <td className="py-2">{p.method}</td>
                  <td className="py-2">{new Date(p.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
