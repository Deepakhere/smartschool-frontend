import { IStudentFormData } from "../../../../../../types";

interface IParentDetailsFormProps {
  t: (key: string) => string;
  formData: IStudentFormData;
  isParentExist: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ParentDetailsForm = ({
  t,
  formData,
  isParentExist,
  handleChange,
}: IParentDetailsFormProps) => {
  return (
    <>
      <h3 className="text-md font-medium mb-4">{t("labels.parent_details")}</h3>
      <div>
        <label
          htmlFor="parentEmail"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("labels.parent_email")}
        </label>
        <input
          type="email"
          id="parentEmail"
          name="parentEmail"
          placeholder={t("messages.enter_parent_email")}
          value={formData.parentEmail}
          onChange={handleChange}
          className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="parentName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("labels.parent_fullname")}
        </label>
        <input
          type="text"
          id="parentName"
          name="parentName"
          placeholder={t("messages.enter_parent_full_name")}
          value={formData.parentName}
          onChange={handleChange}
          disabled={isParentExist}
          className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("labels.phone_number")}
        </label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          placeholder={t("messages.enter_phone_number")}
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default ParentDetailsForm;
