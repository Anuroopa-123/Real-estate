// ============================================================
//  FILE: src/routes/admin.routes.js
// ============================================================
const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/admin.controller");
const { verifyToken }    = require("../middlewares/auth.middleware");
const { isSuperAdmin }   = require("../middlewares/role.middleware");
const { validateBody }   = require("../middlewares/validation.middleware");
const { createUserSchema, updateUserSchema } = require("../validators/admin.validators");

// All admin routes require valid JWT + SUPER_ADMIN role
router.use(verifyToken, isSuperAdmin);

// Dashboard
router.get("/dashboard",             ctrl.getDashboardStats);
router.get("/activity-logs",         ctrl.getActivityLogs);

// User management
router.get("/users",                 ctrl.getAllUsers);
router.get("/users/:id",             ctrl.getUserById);
router.post("/users",                validateBody(createUserSchema), ctrl.createUser);
router.put("/users/:id",             validateBody(updateUserSchema), ctrl.updateUser);
router.delete("/users/:id",          ctrl.deleteUser);
router.patch("/users/:id/toggle",    ctrl.toggleUserStatus);

// Property management
router.get("/properties",            ctrl.getAllProperties);
router.patch("/properties/:id/approve", ctrl.approveProperty);
router.patch("/properties/:id/reject",  ctrl.rejectProperty);
router.delete("/properties/:id",        ctrl.deleteProperty);

// Appointment management
router.get("/appointments",          ctrl.getAllAppointments);
router.patch("/appointments/:id/cancel", ctrl.cancelAppointment);

module.exports = router;