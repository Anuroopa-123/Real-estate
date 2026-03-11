exports.isSuperAdmin = (req, res, next) => {

  if (req.user.role !== "SUPER_ADMIN") {

    return res.status(403).json({
      success: false,
      message: "SuperAdmin access required"
    });

  }

  next();

};