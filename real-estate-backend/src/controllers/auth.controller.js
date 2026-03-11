const authService = require("../services/auth.service");

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const data = await authService.login(email, password);

    res.json({
      success: true,
      data
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};