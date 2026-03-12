// FILE: src/routes/dashboard.routes.js
// ⚠️  This is registered under /api/admin in app.js
// So the full URL becomes:  GET /api/admin/dashboard   ✅

const express    = require('express');
const router     = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { isSuperAdmin } = require('../middlewares/role.middleware');
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/admin/dashboard
router.get('/dashboard', verifyToken, isSuperAdmin, dashboardController.superAdminDashboard);

module.exports = router;