const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = require("../config/auth");
const query = require("../utils/db-query");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    const users = await query(
      "SELECT id, email, token_version FROM users WHERE id = ?",
      [payload.sub]
    );
    const user = users[0];

    if (!user || user.token_version !== payload.tokenVersion) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
