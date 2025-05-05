const ParentHomework = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Homework</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Math Assignment</h2>
            <p className="text-gray-600">Due: 2024-05-10</p>
            <p className="mt-2">Complete exercises 1-10 from chapter 5</p>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Science Project</h2>
            <p className="text-gray-600">Due: 2024-05-15</p>
            <p className="mt-2">Prepare a presentation on the solar system</p>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">English Essay</h2>
            <p className="text-gray-600">Due: 2024-05-20</p>
            <p className="mt-2">Write a 500-word essay on your favorite book</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentHomework; 