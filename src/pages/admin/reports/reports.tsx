import { useReportsController } from "./reports-controller";

const Reports = () => {
  const { formData, handleChange, handleSubjectChange, handleSubmit } =
    useReportsController();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="studentId"
            className="block text-sm font-medium text-gray-700"
          >
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="academicYear"
            className="block text-sm font-medium text-gray-700"
          >
            Academic Year
          </label>
          <input
            type="text"
            id="academicYear"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="term"
            className="block text-sm font-medium text-gray-700"
          >
            Term
          </label>
          <input
            type="text"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects
          </label>
          {formData.subjects.map((subject, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) =>
                      handleSubjectChange(index, "name", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={subject.grade}
                    onChange={(e) =>
                      handleSubjectChange(index, "grade", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <input
                    type="text"
                    value={subject.remarks}
                    onChange={(e) =>
                      handleSubjectChange(index, "remarks", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label
            htmlFor="overallRemarks"
            className="block text-sm font-medium text-gray-700"
          >
            Overall Remarks
          </label>
          <textarea
            id="overallRemarks"
            name="overallRemarks"
            value={formData.overallRemarks}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reports;
