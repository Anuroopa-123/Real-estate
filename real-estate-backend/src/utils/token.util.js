const jwt = require("jsonwebtoken");

// ── Access Token (15 min) ────────────────────────────────────
exports.generateAccessToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");

  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

// ── Refresh Token (7 days) ───────────────────────────────────
exports.generateRefreshToken = (user) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");

  return jwt.sign(
    { id: user.id },
    secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

// ── Verify Access Token ──────────────────────────────────────
exports.verifyAccessToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");
  return jwt.verify(token, secret);
};

// ── Verify Refresh Token ─────────────────────────────────────
exports.verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  return jwt.verify(token, secret);
};