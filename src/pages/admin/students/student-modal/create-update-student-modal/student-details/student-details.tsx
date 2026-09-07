import { IStudentFormData, SelectOption } from "../../../../../../types";
import { useGetAcademicYears, useGetClasses, useGetSections } from "../../../../classes/service/academics-service";
import CustomSelectDropdown from "../../../../../../components/custom-select";

// handleChange only ever reads e.target.name/value, so a minimal fake event is safe here —
// CustomSelectDropdown's onChange gives us an option, not a native change event
const fakeChangeEvent = (name: string, value: string) =>
  ({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement>);

interface IStudentDetailsFormProps {
  t: (key: string) => string;
  organizationId: string;
  formData: IStudentFormData;
  isEditStudent?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StudentDetailsForm = ({
  t,
  organizationId,
  formData,
  isEditStudent,
  handleChange,
}: IStudentDetailsFormProps) => {
  const academicYears = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, formData.academicYearId);
  const sections = useGetSections(organizationId, formData.classId);

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
              id="admissionNumber"
              name="admissionNumber"
              placeholder={t("messages.enter_admission_no")}
              value={formData.admissionNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {isEditStudent ? (
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-1">Class / Section / Roll No.</p>
              <p>Current: {formData.classId ? "assigned" : "unassigned"} — use Promote/Transfer to change enrollment.</p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="academicYearId" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <CustomSelectDropdown
                  placeholder="Select academic year"
                  options={(academicYears.data?.items || []).map((y): SelectOption => ({ id: y.id, name: y.name }))}
                  value={(() => {
                    const y = (academicYears.data?.items || []).find((y) => y.id === formData.academicYearId);
                    return y ? { id: y.id, name: y.name } : null;
                  })()}
                  onChange={(o) => handleChange(fakeChangeEvent("academicYearId", String(o.id)))}
                />
              </div>

              <div>
                <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <CustomSelectDropdown
                  placeholder="Select class"
                  disabled={!formData.academicYearId}
                  options={(classes.data?.items || []).map((k): SelectOption => ({ id: k.id, name: k.name }))}
                  value={(() => {
                    const k = (classes.data?.items || []).find((k) => k.id === formData.classId);
                    return k ? { id: k.id, name: k.name } : null;
                  })()}
                  onChange={(o) => handleChange(fakeChangeEvent("classId", String(o.id)))}
                />
              </div>

              <div>
                <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <CustomSelectDropdown
                  placeholder="Select section"
                  disabled={!formData.classId}
                  options={(sections.data?.items || []).map((s): SelectOption => ({ id: s.id, name: s.name }))}
                  value={(() => {
                    const s = (sections.data?.items || []).find((s) => s.id === formData.sectionId);
                    return s ? { id: s.id, name: s.name } : null;
                  })()}
                  onChange={(o) => handleChange(fakeChangeEvent("sectionId", String(o.id)))}
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
                  className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </>
          )}
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
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default StudentDetailsForm;
