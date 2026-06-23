const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const query = require("../utils/db-query");
const requireAuth = require("../middleware/auth.middleware");
const {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = require("../config/auth");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts. Please try again later." },
});

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

function safeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

function signAccessToken(user) {
  return jwt.sign(
    {
      email: user.email,
      tokenVersion: user.token_version,
    },
    JWT_ACCESS_SECRET,
    {
      subject: String(user.id),
      expiresIn: ACCESS_TOKEN_TTL,
    }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      email: user.email,
      tokenVersion: user.token_version,
    },
    JWT_REFRESH_SECRET,
    {
      subject: String(user.id),
      expiresIn: REFRESH_TOKEN_TTL,
    }
  );
}

function authPayload(user) {
  return {
    user: safeUser(user),
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

router.post("/signup", authLimiter, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!name || name.length > 100) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      });
    }

    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    const users = await query(
      "SELECT id, name, email, token_version FROM users WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json(authPayload(users[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to create account" });
  }
});

router.post("/signin", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!isValidEmail(email) || typeof password !== "string") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const users = await query(
      "SELECT id, name, email, password_hash, token_version FROM users WHERE email = ?",
      [email]
    );

    const user = users[0];
    const isMatch = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json(authPayload(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to sign in" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const users = await query(
      "SELECT id, name, email, token_version FROM users WHERE id = ?",
      [payload.sub]
    );
    const user = users[0];

    if (!user || user.token_version !== payload.tokenVersion) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    return res.json(authPayload(user));
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", requireAuth, async (req, res) => {
  try {
    await query("UPDATE users SET token_version = token_version + 1 WHERE id = ?", [
      req.user.id,
    ]);
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to log out" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const users = await query("SELECT id, name, email FROM users WHERE id = ?", [
      req.user.id,
    ]);

    if (!users[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: safeUser(users[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to load user" });
  }
});

module.exports = router;
