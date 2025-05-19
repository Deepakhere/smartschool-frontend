export const APIS_ROUTES = {
  SIGNIN: "/auth/v1/user/signin",
  FORGOT_PASSWORD: "/auth/v1/user/forgot-password",
  RESET_PASSWORD: "/auth/v1/user/reset-password/:token",
  GET_USER_DETAILS: "/auth/v1/user/get-user-details",
  ADD_USER: "/auth/v1/user/add-user",
  GET_ALL_USER: "/auth/v1/user/get-all-users",
  STUDENT_PROFILE: "/student-service/v1/profile",
  UPDATE_USER_DETAILS: "/auth/v1/user/update-user-details",
  DELETE_USER: "/auth/v1/user/delete-user",
  ORGANIZATION_SERVICE: "/organization-service/v1/organization",
  SCHOOL_SERVICE: "/school-service/v1/school",
  AI_SERVICE: "/ai-service/v1/generate-content",
};

export const API_QUERY_KEY = {
  GET_MODEL_STATISTICS_PERSONALIZATION: "get-model-statistics-personalization",
  GET_USER_DETAILS: "get-user-details",
  GET_ALL_USER: "get-all-user",
  GET_STUDENT_PROFILE: "get-student-profile",
  GET_ALL_ORGANIZATIONS: "get-all-organizations",
  GET_PARENT_DETAILS: "get-parent-details",
  GET_STUDENT_BY_ID: "get-student-by-id",
  GET_NOTICE_LIST: "get-notice-list",
  AI_CONTENT: "get-ai-content",
};

export const API_MUTATION_KEY = {
  SIGNIN: "signin",
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  ADD_USER: "add-user",
  ADD_STUDENT_PROFILE: "add-student-profile",
  UPDATE_USER_DETAILS: "update-user-details",
  DELETE_USER: "delete-user",
  UPDATE_STUDENT_DETAILS: "update-student-details",
  DELETE_STUDENT: "delete-student",
  CREATE_NOTICE: "create-notice",
};

export const PASSWORD_CIPHER_MESSAGE = "KID_SIGHT_KEY";

export const GOOGLE_CAPTCHA_KEY = "6LeCtSorAAAAAN38EwKA3qBHzEWYsx6is3RT8eSa";

export const EMAIL_REGEX_PATTERN = new RegExp(
  /^[a-zA-Z0-9._+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})$/i
);

export const USER_ACCESS_KEY = {
  TOKEN: "kidSightAccessToken",
  ROLE: "kidSightUserRole",
  ORGANIZATION_ID: "kidSightOrganizationId",
  ORGANIZATION_NAME: "kidSightOrganizationName",
};

export const TOTAL_STEPS = 2;
