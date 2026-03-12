const jwt = require("jsonwebtoken");

const { verifyAccessToken } = require("../utils/token.util");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();

  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }

    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};