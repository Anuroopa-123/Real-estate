const db = require("../config/db.config");

exports.createAgent = async ({ name, email, password }) => {

  const [result] = await db.query(
    `INSERT INTO users (name,email,password,role)
     VALUES (?,?,?,'AGENT')`,
    [name, email, password]
  );

  return { id: result.insertId };
};

exports.findAgents = async () => {

  const [rows] = await db.query(
    `SELECT id,name,email,status,created_at
     FROM users
     WHERE role='AGENT'
     ORDER BY created_at DESC`
  );

  return rows;

};

exports.deleteAgent = async (id) => {

  await db.query(
    `DELETE FROM users WHERE id=? AND role='AGENT'`,
    [id]
  );

};