export const APIS_ROUTES = {
  SIGNIN: "/auth/v1/user/signin",
  FORGOT_PASSWORD: "/auth/v1/user/forgot-password",
  RESET_PASSWORD: "/auth/v1/user/reset-password/:token",
  GET_USER_DETAILS: "/auth/v1/user/get-user-details",
};

export const API_QUERY_KEY = {
  GET_MODEL_STATISTICS_PERSONALIZATION: "get-model-statistics-personalization",
  GET_USER_DETAILS: "get-user-details",
};

export const API_MUTATION_KEY = {
  SIGNIN: "signin",
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
};

export const PASSWORD_CIPHER_MESSAGE = "KID_SIGHT_KEY";

export const GOOGLE_CAPTCHA_KEY = "6LeCtSorAAAAAN38EwKA3qBHzEWYsx6is3RT8eSa";

export const EMAIL_REGEX_PATTERN = new RegExp(
  /^[a-zA-Z0-9._+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})$/i
);

export const USER_ACCESS_KEY = {
  TOKEN: "kidSightAccessToken",
  ROLE: "kidSightUserRole",
};
