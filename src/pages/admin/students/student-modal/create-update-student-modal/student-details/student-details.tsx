import { IStudentFormData } from "../../../../../../types";

interface IStudentDetailsFormProps {
  t: (key: string) => string;
  formData: IStudentFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StudentDetailsForm = ({
  t,
  formData,
  handleChange,
}: IStudentDetailsFormProps) => {
  return (
    <>
      <h3 className="text-md font-medium mb-4">
        {t("labels.student_details")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="admissionId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.admission_no")}
            </label>
            <input
              type="text"
              id="admissionId"
              name="admissionId"
              placeholder={t("messages.enter_admission_no")}
              value={formData.admissionId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="admissionDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.admission_date")}
            </label>
            <input
              type="date"
              id="admissionDate"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="classId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.class_id")}
            </label>
            <input
              type="text"
              id="classId"
              name="classId"
              placeholder={t("messages.enter_class_id")}
              value={formData.classId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="rollNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.roll_number")}
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              placeholder={t("messages.enter_roll_no")}
              value={formData.rollNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.fullname")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t("messages.enter_fullname")}
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.date_of_birth")}
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.city")}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder={t("messages.enter_city")}
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("labels.state")}
            </label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder={t("messages.enter_state")}
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Full width field */}
      <div className="mt-4">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("labels.address")}
        </label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder={t("messages.enter_full_address")}
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default StudentDetailsForm;
