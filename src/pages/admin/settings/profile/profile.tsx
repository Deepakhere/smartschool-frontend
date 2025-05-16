import {
  UserIcon,
  PencilIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  KeyIcon,
  GlobeAltIcon,
  MoonIcon,
  BellIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import useProfileController from "./profile-controller";
import LogoSpinner from "../../../../components/logo-spinner";

const AdminProfile = () => {
  const {
    t,
    user,
    editMode,
    imageUrl,
    currentLanguage,
    theme,
    setEditMode,
    handleAvatarChange,
    changeLanguage,
    changeTheme,
  } = useProfileController();
  return (
    <>
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t("labels.profile")}</h1>
      </div> */}
      {!user ? (
        <LogoSpinner />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t("labels.profile_information")}
                    </h3>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? (
                        <>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          {t("labels.save")}
                        </>
                      ) : (
                        <>
                          <PencilIcon className="h-4 w-4 mr-2" />
                          {t("buttons.edit")}
                        </>
                      )}
                    </button>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    {editMode ? (
                      <form className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("labels.fullname")}
                          </label>
                          <input
                            type="text"
                            id="name"
                            defaultValue={user?.name}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("labels.email_address")}
                          </label>
                          <input
                            type="email"
                            id="email"
                            defaultValue={user.email}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("labels.phone_number")}
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            defaultValue="+91 9876543210"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("labels.role")}
                          </label>
                          <input
                            type="text"
                            id="role"
                            defaultValue={`${user?.role
                              ?.charAt(0)
                              .toUpperCase()}${user?.role?.slice(1)}`}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                          />
                        </div>
                      </form>
                    ) : (
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            {t("labels.fullname")}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {user?.name}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            {t("labels.email_address")}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {user?.email}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            {t("labels.phone_number")}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {user?.phoneNumber}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            {t("labels.role")}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {`${user?.role
                              ?.charAt(0)
                              .toUpperCase()}${user?.role?.slice(1)}`}
                          </dd>
                        </div>
                      </dl>
                    )}
                  </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
                      {t("labels.change_password")}
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t("labels.current_password")}
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t("labels.new_password")}
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t("labels.confirm_new_password")}
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {t("labels.update_password")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right column - 1/3 width */}
              <div className="space-y-6">
                {/* Your Photo Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t("labels.your_photo")}
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 relative mb-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50"
                        >
                          <ArrowUpTrayIcon className="h-5 w-5 text-gray-600" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {t("labels.upload_photo_instruction")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preferences Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t("labels.preferences")}
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="language"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-500" />
                          {t("labels.language")}
                        </label>
                        <select
                          id="language"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={currentLanguage}
                          onChange={(e) => changeLanguage(e.target.value)}
                        >
                          <option value="en">
                            {t("common.languages.english")}
                          </option>
                          <option value="hn">
                            {t("common.languages.hindi")}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="theme"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <MoonIcon className="h-5 w-5 mr-2 text-gray-500" />
                          {t("labels.theme")}
                        </label>
                        <select
                          id="theme"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={theme}
                          onChange={(e) =>
                            changeTheme(e.target.value as "light" | "dark")
                          }
                        >
                          <option value="light">
                            {t("common.themes.light")}
                          </option>
                          <option value="dark">
                            {t("common.themes.dark")}
                          </option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="emailNotifications"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                          {t("labels.email_notifications")}
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="smsNotifications"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <BellIcon className="h-5 w-5 mr-2 text-gray-500" />
                          {t("labels.sms_notifications")}
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="smsNotifications"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProfile;
