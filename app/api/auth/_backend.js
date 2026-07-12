export const authApiUrl = process.env.AUTH_API_URL || "http://127.0.0.1:5000";
export const accessCookie = "glennluna_access";
export const refreshCookie = "glennluna_refresh";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
