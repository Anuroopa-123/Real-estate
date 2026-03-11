const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../utils/token.util");

exports.login = async (email, password) => {

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email
    }
  };
};