// ============================================================
//  FILE: src/controllers/admin.controller.js
// ============================================================
const adminService = require("../services/admin.service");

// ── Dashboard Stats ──────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── User CRUD ────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const data = await adminService.getAllUsers({ page: +page, limit: +limit, role, status, search });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await adminService.createUser(req.body, req.user.id);
    res.status(201).json({ success: true, data: user, message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: user, message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id, req.user.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await adminService.toggleUserStatus(req.params.id, req.user.id);
    res.json({ success: true, data: user, message: `User ${user.status.toLowerCase()}d` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Property Management ───────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, city, search } = req.query;
    const data = await adminService.getAllProperties({ page: +page, limit: +limit, status, city, search });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const prop = await adminService.updatePropertyStatus(req.params.id, "APPROVED", req.user.id);
    res.json({ success: true, data: prop, message: "Property approved" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.rejectProperty = async (req, res) => {
  try {
    const prop = await adminService.updatePropertyStatus(req.params.id, "REJECTED", req.user.id);
    res.json({ success: true, data: prop, message: "Property rejected" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await adminService.deleteProperty(req.params.id, req.user.id);
    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Appointment Management ────────────────────────────────────
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const data = await adminService.getAllAppointments({ page: +page, limit: +limit, status });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appt = await adminService.cancelAppointment(req.params.id, reason, req.user.id);
    res.json({ success: true, data: appt, message: "Appointment cancelled" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Activity Logs ─────────────────────────────────────────────
exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await adminService.getActivityLogs({ page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};