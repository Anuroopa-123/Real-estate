const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const { hashPassword, comparePassword } = require("../utils/hash.util");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token.util");
const db = require("../config/db.config");
 
exports.login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  if (user.status === "INACTIVE") throw new Error("Account is inactive");
 
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
 
  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
 
  // Store refresh token (7 days)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,?)",
    [user.id, refreshToken, expiresAt]
  );
 
  const { password: _, ...safeUser } = user;
  return { token: accessToken, refreshToken, user: safeUser };
};
 
exports.refresh = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token required");
 
  const [[stored]] = await db.query(
    "SELECT * FROM refresh_tokens WHERE token = ? AND revoked = 0 AND expires_at > NOW()",
    [refreshToken]
  );
  if (!stored) throw new Error("Invalid or expired refresh token");
 
  const payload = verifyRefreshToken(refreshToken);
  const user = await userRepository.findById(payload.id);
  if (!user) throw new Error("User not found");
 
  // Rotate: revoke old, issue new
  await db.query("UPDATE refresh_tokens SET revoked = 1 WHERE id = ?", [stored.id]);
 
  const newAccess  = generateAccessToken(user);
  const newRefresh = generateRefreshToken(user);
  const expiresAt  = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
 
  await db.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,?)",
    [user.id, newRefresh, expiresAt]
  );
 
  return { token: newAccess, refreshToken: newRefresh };
};
 
exports.logout = async (refreshToken) => {
  await db.query("UPDATE refresh_tokens SET revoked = 1 WHERE token = ?", [refreshToken]);
};
 