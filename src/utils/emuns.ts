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
  SCHOOL_SERVICE: "/school-service/v1",
  AI_SERVICE: "/ai-service/v1/generate-content",
  ACADEMIC_SERVICE: "/academic-service/v1",
  DASHBOARD_SERVICE: "/dashboard-service/v1",
  STAFF_SERVICE: "/staff-service/v1",
  ATTENDANCE_SERVICE: "/attendance-service/v1",
  HOMEWORK_SERVICE: "/homework-service/v1",
  PTM_SERVICE: "/ptm-service/v1",
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
  GET_ACADEMIC_YEARS: "get-academic-years",
  GET_CLASSES: "get-classes",
  GET_SECTIONS: "get-sections",
  GET_SUBJECTS: "get-subjects",
  GET_TEACHER_ASSIGNMENTS: "get-teacher-assignments",
  GET_ALL_TEACHERS: "get-all-teachers",
  GET_DASHBOARD_STATS: "get-dashboard-stats",
  GET_TEACHER_DIRECTORY: "get-teacher-directory",
  GET_SECTION_ATTENDANCE: "get-section-attendance",
  GET_HOMEWORK_LIST: "get-homework-list",
  GET_MY_TEACHING_LOAD: "get-my-teaching-load",
  GET_MY_NOTICES: "get-my-notices",
  GET_MY_NOTIFICATIONS: "get-my-notifications",
  GET_PTM_EVENTS: "get-ptm-events",
  GET_PTM_SLOTS: "get-ptm-slots",
  GET_MY_PTM_BOOKINGS: "get-my-ptm-bookings",
  GET_MY_PTM_AGENDA: "get-my-ptm-agenda",
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
  CREATE_HOMEWORK: "create-homework",
  DELETE_HOMEWORK: "delete-homework",
  DELETE_NOTICE: "delete-notice",
  CREATE_ORGANIZATION: "create-organization",
  CREATE_ACADEMIC_YEAR: "create-academic-year",
  CREATE_CLASS: "create-class",
  CREATE_SECTION: "create-section",
  CREATE_SUBJECT: "create-subject",
  ASSIGN_TEACHER: "assign-teacher",
  MARK_NOTICE_READ: "mark-notice-read",
  MARK_NOTIFICATION_READ: "mark-notification-read",
  CREATE_PTM_EVENT: "create-ptm-event",
  GENERATE_PTM_SLOTS: "generate-ptm-slots",
  BOOK_PTM_SLOT: "book-ptm-slot",
  CANCEL_PTM_BOOKING: "cancel-ptm-booking",
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
