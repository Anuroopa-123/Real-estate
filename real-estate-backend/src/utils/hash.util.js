const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
 
exports.hashPassword = async (plain) => bcrypt.hash(plain, SALT_ROUNDS);
exports.comparePassword = async (plain, hash) => bcrypt.compare(plain, hash);