// NOTE: dotenv is loaded in server.js — do NOT call require("dotenv").config() here
const express   = require("express");
const helmet    = require("helmet");
const cors      = require("cors");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middlewares/error.middleware");

const authRoutes  = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:4200",
  credentials: true,
}));

// Rate limiting
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later." }
}));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth",  authRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;