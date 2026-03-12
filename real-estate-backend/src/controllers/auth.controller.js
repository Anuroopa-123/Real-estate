const authService = require("../services/auth.service");

 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const data = await authService.login(email, password);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
 
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.json({ success: true, data });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
 
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};