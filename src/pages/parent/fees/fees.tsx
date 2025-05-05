const ParentFees = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fees</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Current Month</h2>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tuition Fee</p>
                <p className="text-lg font-semibold">$500.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transportation</p>
                <p className="text-lg font-semibold">$100.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Meals</p>
                <p className="text-lg font-semibold">$150.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-semibold">$750.00</p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Payment History</h2>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">March 2024</p>
                <p className="text-sm font-semibold">Paid</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">February 2024</p>
                <p className="text-sm font-semibold">Paid</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">January 2024</p>
                <p className="text-sm font-semibold">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentFees; 