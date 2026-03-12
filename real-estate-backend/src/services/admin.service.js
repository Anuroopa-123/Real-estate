// ============================================================
//  FILE: src/services/admin.service.js
// ============================================================
const adminRepository  = require("../repositories/admin.repository");
const userRepository   = require("../repositories/user.repository");
const { hashPassword } = require("../utils/hash.util");
const { paginate }     = require("../utils/pagination.util");

// ── Dashboard ────────────────────────────────────────────────
exports.getDashboardStats = async () => {
  const [users, properties, appointments, revenue, recentUsers, activity, roleBreakdown] =
    await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countProperties(),
      adminRepository.countAppointments(),
      adminRepository.getTotalRevenue(),
      adminRepository.getRecentUsers(5),
      adminRepository.getRecentActivity(10),
      adminRepository.getRoleBreakdown(),
    ]);

  return { users, properties, appointments, revenue, recentUsers, activity, roleBreakdown };
};

// ── Users ────────────────────────────────────────────────────
exports.getAllUsers = async ({ page, limit, role, status, search }) => {
  const { offset } = paginate(page, limit);
  const [rows, total] = await Promise.all([
    adminRepository.findUsers({ offset, limit, role, status, search }),
    adminRepository.countUsersFiltered({ role, status, search }),
  ]);
  return {
    data: rows,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.getUserById = async (id) => {
  return adminRepository.findUserById(id);
};

exports.createUser = async (body, adminId) => {
  const { name, email, password, role, status = "ACTIVE", phone } = body;

  if (!name || !email || !password || !role)
    throw new Error("name, email, password and role are required");

  const allowed = ["ADMIN", "AGENT", "BUYER"];
  if (!allowed.includes(role))
    throw new Error(`Role must be one of: ${allowed.join(", ")}`);

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new Error("Email already in use");

  const hashed = await hashPassword(password);
  const userId = await adminRepository.insertUser({
 name,
 email,
 password: hashed,
 role,
 status
});
if (role === "ADMIN") {

  await adminRepository.insertAdminProfile({
    userId,
    phone,
    createdBy: adminId
  });

}

  await adminRepository.logAction(adminId, "CREATE_USER", "USER", userId, { name, email, role });

  return adminRepository.findUserById(userId);
};

exports.updateUser = async (id, body, adminId) => {
  const { name, email, role, status, phone } = body;

  const existing = await adminRepository.findUserById(id);
  if (!existing) throw new Error("User not found");

  // Prevent modifying SUPER_ADMIN
  if (existing.role === "SUPER_ADMIN" && role && role !== "SUPER_ADMIN")
    throw new Error("Cannot change SUPER_ADMIN role");

  if (email && email !== existing.email) {
    const taken = await userRepository.findByEmail(email);
    if (taken) throw new Error("Email already in use");
  }

  await adminRepository.updateUser(id, { name, email, role, status, phone });
  await adminRepository.logAction(adminId, "UPDATE_USER", "USER", id, body);

  return adminRepository.findUserById(id);
};

exports.deleteUser = async (id, adminId) => {
  const user = await adminRepository.findUserById(id);
  if (!user) throw new Error("User not found");
  if (user.role === "SUPER_ADMIN") throw new Error("Cannot delete Super Admin");

  await adminRepository.deleteUser(id);
  await adminRepository.logAction(adminId, "DELETE_USER", "USER", id, { name: user.name });
};

exports.toggleUserStatus = async (id, adminId) => {
  const user = await adminRepository.findUserById(id);
  if (!user) throw new Error("User not found");
  if (user.role === "SUPER_ADMIN") throw new Error("Cannot deactivate Super Admin");

  const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await adminRepository.updateUser(id, { status: newStatus });
  await adminRepository.logAction(adminId, `TOGGLE_STATUS_${newStatus}`, "USER", id, {});

  return adminRepository.findUserById(id);
};

// ── Properties ───────────────────────────────────────────────
exports.getAllProperties = async ({ page, limit, status, city, search }) => {
  const { offset } = paginate(page, limit);
  const [rows, total] = await Promise.all([
    adminRepository.findProperties({ offset, limit, status, city, search }),
    adminRepository.countPropertiesFiltered({ status, city, search }),
  ]);
  return {
    data: rows,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.updatePropertyStatus = async (id, status, adminId) => {
  const prop = await adminRepository.findPropertyById(id);
  if (!prop) throw new Error("Property not found");

  await adminRepository.updatePropertyStatus(id, status);
  await adminRepository.logAction(adminId, `${status}_PROPERTY`, "PROPERTY", id, { title: prop.title });

  return adminRepository.findPropertyById(id);
};

exports.deleteProperty = async (id, adminId) => {
  const prop = await adminRepository.findPropertyById(id);
  if (!prop) throw new Error("Property not found");

  await adminRepository.deleteProperty(id);
  await adminRepository.logAction(adminId, "DELETE_PROPERTY", "PROPERTY", id, { title: prop.title });
};

// ── Appointments ─────────────────────────────────────────────
exports.getAllAppointments = async ({ page, limit, status }) => {
  const { offset } = paginate(page, limit);
  const [rows, total] = await Promise.all([
    adminRepository.findAppointments({ offset, limit, status }),
    adminRepository.countAppointmentsFiltered({ status }),
  ]);
  return {
    data: rows,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.cancelAppointment = async (id, reason, adminId) => {
  const appt = await adminRepository.findAppointmentById(id);
  if (!appt) throw new Error("Appointment not found");
  if (appt.status === "CANCELLED") throw new Error("Already cancelled");

  await adminRepository.updateAppointmentStatus(id, "CANCELLED", reason);
  await adminRepository.logAction(adminId, "CANCEL_APPOINTMENT", "APPOINTMENT", id, { reason });

  return adminRepository.findAppointmentById(id);
};

// ── Logs ──────────────────────────────────────────────────────
exports.getActivityLogs = async ({ page, limit }) => {
  const { offset } = paginate(page, limit);
  const [rows, total] = await Promise.all([
    adminRepository.findActivityLogs({ offset, limit }),
    adminRepository.countActivityLogs(),
  ]);
  return {
    data: rows,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};