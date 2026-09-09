// one shared shape for every auth-related cookie — avoids the options drifting
// out of sync across the handful of places that set them (login, silent refresh,
// the org picker). `expires` is in days, matching js-cookie's own convention.
export const authCookieOptions = (expiresInDays: number) => ({
  secure: true,
  sameSite: "lax" as const,
  expires: expiresInDays,
});
