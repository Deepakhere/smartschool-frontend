const ParentReports = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Quarterly Report</h2>
            <p className="text-gray-600">Date: 2024-04-01</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Math</p>
                <p className="text-lg font-semibold">A</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Science</p>
                <p className="text-lg font-semibold">B+</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">English</p>
                <p className="text-lg font-semibold">A-</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">History</p>
                <p className="text-lg font-semibold">B</p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Attendance Report</h2>
            <p className="text-gray-600">Period: March 2024</p>
            <div className="mt-2">
              <p className="text-sm">Total Days: 22</p>
              <p className="text-sm">Present: 20</p>
              <p className="text-sm">Absent: 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentReports; 