// ============================================================
//  FILE: src/repositories/admin.repository.js
// ============================================================
const db = require("../config/db.config");

// ── Dashboard counts ─────────────────────────────────────────
exports.countUsers = async () => {
  const [[row]] = await db.query(
    `SELECT
       COUNT(*)                                          AS total,
       SUM(status = 'ACTIVE')                           AS active,
       SUM(status = 'INACTIVE')                         AS inactive,
       SUM(role = 'ADMIN')                              AS admins,
       SUM(role = 'AGENT')                              AS agents,
       SUM(role = 'BUYER')                              AS buyers
     FROM users`
  );
  return row;
};

exports.countProperties = async () => {
  const [[row]] = await db.query(
    `SELECT
       COUNT(*)                          AS total,
       SUM(status = 'PENDING')           AS pending,
       SUM(status = 'APPROVED')          AS approved,
       SUM(status = 'REJECTED')          AS rejected,
       SUM(status = 'SOLD')              AS sold
     FROM properties`
  );
  return row;
};

exports.countAppointments = async () => {
  const [[row]] = await db.query(
    `SELECT
       COUNT(*)                            AS total,
       SUM(status = 'PENDING')             AS pending,
       SUM(status = 'CONFIRMED')           AS confirmed,
       SUM(DATE(scheduled_at) = CURDATE()) AS today
     FROM appointments`
  );
  return row;
};

exports.getTotalRevenue = async () => {
  const [[row]] = await db.query(
    `SELECT
       COALESCE(SUM(p.price), 0) AS total_revenue,
       COUNT(*)                  AS total_sold
     FROM properties p
     WHERE p.status = 'SOLD'`
  );
  return row;
};

exports.getRoleBreakdown = async () => {
  const [rows] = await db.query(
    `SELECT role, COUNT(*) AS count
     FROM users
     GROUP BY role
     ORDER BY count DESC`
  );
  return rows;
};

exports.getRecentUsers = async (limit = 5) => {
  const [rows] = await db.query(
    `SELECT id, name, email, role, status, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

exports.getRecentActivity = async (limit = 10) => {
  const [rows] = await db.query(
    `SELECT al.*, u.name AS admin_name
     FROM admin_logs al
     JOIN users u ON al.admin_id = u.id
     ORDER BY al.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

// ── Users CRUD ───────────────────────────────────────────────
exports.findUsers = async ({ offset, limit, role, status, search }) => {
  let q = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      u.status,
      a.phone,
      u.created_at
    FROM users u
    LEFT JOIN admins a ON a.user_id = u.id
    WHERE 1=1`;
  const params = [];

  if (role)   { q += " AND role = ?";              params.push(role); }
  if (status) { q += " AND status = ?";            params.push(status); }
  if (search) { q += " AND (name LIKE ? OR email LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

  q += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await db.query(q, params);
  return rows;
};

exports.countUsersFiltered = async ({ role, status, search }) => {
  let q = "SELECT COUNT(*) AS total FROM users WHERE 1=1";
  const params = [];

  if (role)   { q += " AND role = ?";              params.push(role); }
  if (status) { q += " AND status = ?";            params.push(status); }
  if (search) { q += " AND (name LIKE ? OR email LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

  const [[row]] = await db.query(q, params);
  return row.total;
};
exports.findUserById = async (id) => {
  const [[row]] = await db.query(
    `SELECT 
       u.id,
       u.name,
       u.email,
       u.role,
       u.status,
       a.phone,
       u.created_at
     FROM users u
     LEFT JOIN admins a ON a.user_id = u.id
     WHERE u.id = ?`,
    [id]
  );
  return row || null;
};

exports.insertUser = async ({ name, email, password, role, status }) => {

  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, role, status]
  );

  return result.insertId;
};
exports.updateUser = async (id, fields) => {
 const allowed = ["name", "email", "role", "status"];
  const sets = [];
  const values = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (!sets.length) return;
  values.push(id);
  await db.query(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, values);
};

exports.deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};

// ── Properties ───────────────────────────────────────────────
exports.findProperties = async ({ offset, limit, status, city, search }) => {
  let q = `
    SELECT p.*, u.name AS agent_name, c.name AS category_name,
           (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
    FROM properties p
    JOIN users u ON p.agent_id = u.id
    JOIN property_categories c ON p.category_id = c.id
    WHERE 1=1`;
  const params = [];

  if (status) { q += " AND p.status = ?"; params.push(status); }
  if (city)   { q += " AND p.city = ?";   params.push(city); }
  if (search) { q += " AND MATCH(p.title, p.description, p.city) AGAINST(? IN BOOLEAN MODE)"; params.push(search); }

  q += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await db.query(q, params);
  return rows;
};

exports.countPropertiesFiltered = async ({ status, city, search }) => {
  let q = "SELECT COUNT(*) AS total FROM properties WHERE 1=1";
  const params = [];

  if (status) { q += " AND status = ?"; params.push(status); }
  if (city)   { q += " AND city = ?";   params.push(city); }
  if (search) { q += " AND MATCH(title, description, city) AGAINST(? IN BOOLEAN MODE)"; params.push(search); }

  const [[row]] = await db.query(q, params);
  return row.total;
};

exports.findPropertyById = async (id) => {
  const [[row]] = await db.query(
    `SELECT p.*, u.name AS agent_name, c.name AS category_name
     FROM properties p
     JOIN users u ON p.agent_id = u.id
     JOIN property_categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  return row || null;
};

exports.updatePropertyStatus = async (id, status) => {
  await db.query("UPDATE properties SET status = ? WHERE id = ?", [status, id]);
};

exports.deleteProperty = async (id) => {
  await db.query("DELETE FROM properties WHERE id = ?", [id]);
};

// ── Appointments ─────────────────────────────────────────────
exports.findAppointments = async ({ offset, limit, status }) => {
  let q = `
    SELECT a.*,
           b.name AS buyer_name, b.email AS buyer_email,
           ag.name AS agent_name,
           p.title AS property_title, p.city AS property_city
    FROM appointments a
    JOIN users b   ON a.buyer_id    = b.id
    JOIN users ag  ON a.agent_id    = ag.id
    JOIN properties p ON a.property_id = p.id
    WHERE 1=1`;
  const params = [];

  if (status) { q += " AND a.status = ?"; params.push(status); }

  q += " ORDER BY a.scheduled_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await db.query(q, params);
  return rows;
};

exports.countAppointmentsFiltered = async ({ status }) => {
  let q = "SELECT COUNT(*) AS total FROM appointments WHERE 1=1";
  const params = [];
  if (status) { q += " AND status = ?"; params.push(status); }
  const [[row]] = await db.query(q, params);
  return row.total;
};

exports.findAppointmentById = async (id) => {
  const [[row]] = await db.query(
    `SELECT a.*, b.name AS buyer_name, ag.name AS agent_name, p.title AS property_title
     FROM appointments a
     JOIN users b ON a.buyer_id = b.id
     JOIN users ag ON a.agent_id = ag.id
     JOIN properties p ON a.property_id = p.id
     WHERE a.id = ?`,
    [id]
  );
  return row || null;
};

exports.updateAppointmentStatus = async (id, status, reason = null) => {
  await db.query(
    "UPDATE appointments SET status = ?, cancellation_reason = ? WHERE id = ?",
    [status, reason, id]
  );
};

// ── Audit Log ─────────────────────────────────────────────────
exports.logAction = async (adminId, action, targetType, targetId, meta) => {
  await db.query(
    `INSERT INTO admin_logs (admin_id, action, target_type, target_id, meta)
     VALUES (?, ?, ?, ?, ?)`,
    [adminId, action, targetType, targetId, JSON.stringify(meta)]
  );
};

exports.findActivityLogs = async ({ offset, limit }) => {
  const [rows] = await db.query(
    `SELECT al.*, u.name AS admin_name, u.role AS admin_role
     FROM admin_logs al
     JOIN users u ON al.admin_id = u.id
     ORDER BY al.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
};

exports.countActivityLogs = async () => {
  const [[row]] = await db.query("SELECT COUNT(*) AS total FROM admin_logs");
  return row.total;
};

exports.insertAdminProfile = async ({ userId, phone, createdBy }) => {

  await db.query(
    `INSERT INTO admins (user_id, phone, created_by)
     VALUES (?, ?, ?)`,
    [userId, phone || null, createdBy]
  );

};