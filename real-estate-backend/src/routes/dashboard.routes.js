const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const { isSuperAdmin } = require("../middlewares/role.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get(
  "/superadmin",
  verifyToken,
  isSuperAdmin,
  dashboardController.superAdminDashboard
);

module.exports = router;