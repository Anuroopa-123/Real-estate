exports.superAdminDashboard = async (req, res) => {

  res.json({
    success: true,
    message: "Welcome Super Admin",
    user: req.user
  });

};