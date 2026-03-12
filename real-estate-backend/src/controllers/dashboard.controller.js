// FILE: src/controllers/dashboard.controller.js
const db = require('../config/db.config');

exports.superAdminDashboard = async (req, res) => {
  try {
    // ── Counts ────────────────────────────────────────────────
    const [[userRow]]        = await db.query(`SELECT COUNT(*) AS total FROM users`);
    const [[adminRow]]       = await db.query(`SELECT COUNT(*) AS total FROM users WHERE role='ADMIN'`);
    const [[agentRow]]       = await db.query(`SELECT COUNT(*) AS total FROM users WHERE role='AGENT' AND status='ACTIVE'`);
    const [[buyerRow]]       = await db.query(`SELECT COUNT(*) AS total FROM users WHERE role='BUYER'`);
    const [[propRow]]        = await db.query(`SELECT COUNT(*) AS total FROM properties`);
    const [[pendingPropRow]] = await db.query(`SELECT COUNT(*) AS total FROM properties WHERE status='PENDING'`);
    const [[approvedRow]]    = await db.query(`SELECT COUNT(*) AS total FROM properties WHERE status='APPROVED'`);
    const [[rejectedRow]]    = await db.query(`SELECT COUNT(*) AS total FROM properties WHERE status='REJECTED'`);
    const [[soldRow]]        = await db.query(`SELECT COUNT(*) AS total FROM properties WHERE status='SOLD'`);
    const [[apptRow]]        = await db.query(`SELECT COUNT(*) AS total FROM appointments`);
    const [[todayApptRow]]   = await db.query(`SELECT COUNT(*) AS total FROM appointments WHERE DATE(created_at)=CURDATE()`);
    const [[newUsersRow]]    = await db.query(`SELECT COUNT(*) AS total FROM users WHERE DATE(created_at)=CURDATE()`);

    // ── Recent Users ──────────────────────────────────────────
    const [recentUsers] = await db.query(
      `SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC LIMIT 6`
    );

    // ── Recent Properties ─────────────────────────────────────
    const [recentProperties] = await db.query(
      `SELECT p.id, p.title, p.price, p.city, p.status, p.created_at,
              u.name AS agent_name
       FROM properties p
       LEFT JOIN users u ON u.id = p.agent_id
       ORDER BY p.created_at DESC LIMIT 5`
    );

    // ── Recent Appointments ───────────────────────────────────
    const [recentAppointments] = await db.query(
      `SELECT a.id, a.scheduled_at, a.status,
              b.name AS buyer_name,
              pr.title AS property_title
       FROM appointments a
       LEFT JOIN users b  ON b.id = a.buyer_id
       LEFT JOIN properties pr ON pr.id = a.property_id
       ORDER BY a.created_at DESC LIMIT 5`
    );

    // ── Audit Logs ────────────────────────────────────────────
    const [auditLogs] = await db.query(
      `SELECT al.id, al.action, al.target_type, al.target_id, al.created_at,
              u.name AS admin_name, u.role AS admin_role
       FROM admin_logs al
       LEFT JOIN users u ON u.id = al.admin_id
       ORDER BY al.created_at DESC LIMIT 8`
    ).catch(() => [[]]);   // graceful if table missing

    res.json({
      success: true,
      data: {
        // Counts
        totalUsers:           userRow.total,
        totalAdmins:          adminRow.total,
        totalAgents:          agentRow.total,
        totalBuyers:          buyerRow.total,
        totalProperties:      propRow.total,
        pendingProperties:    pendingPropRow.total,
        approvedProperties:   approvedRow.total,
        rejectedProperties:   rejectedRow.total,
        soldProperties:       soldRow.total,
        totalAppointments:    apptRow.total,
        todayAppointments:    todayApptRow.total,
        newUsersToday:        newUsersRow.total,
        activeAgents:         agentRow.total,

        // Lists
        recentUsers,
        recentProperties,
        recentAppointments,
        auditLogs,
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};