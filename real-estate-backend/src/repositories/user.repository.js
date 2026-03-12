const db = require("../config/db.config");
 
exports.findByEmail = async (email) => {
  const [[row]] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return row || null;
};
 
exports.findById = async (id) => {
  const [[row]] = await db.query(
    "SELECT id, name, email, role, status, phone, avatar_url, created_at FROM users WHERE id = ?",
    [id]
  );
  return row || null;
};