const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-before-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-before-production";

const isProduction = process.env.NODE_ENV === "production";

if (
  isProduction &&
  (JWT_ACCESS_SECRET.includes("dev-") || JWT_REFRESH_SECRET.includes("dev-"))
) {
  throw new Error("JWT secrets must be configured in production");
}

module.exports = {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
};
