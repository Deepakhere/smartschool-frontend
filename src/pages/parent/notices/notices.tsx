const ParentNotices = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notices</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Parent-Teacher Meeting</h2>
            <p className="text-gray-600">Date: 2024-05-15</p>
            <p className="mt-2">Please attend the quarterly parent-teacher meeting to discuss your child's progress.</p>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">School Holiday</h2>
            <p className="text-gray-600">Date: 2024-05-20</p>
            <p className="mt-2">School will be closed on May 20th for maintenance work.</p>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Annual Sports Day</h2>
            <p className="text-gray-600">Date: 2024-05-25</p>
            <p className="mt-2">Join us for the annual sports day celebration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNotices; 