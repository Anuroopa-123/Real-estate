require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db.config");

const createSuperAdmin = async () => {

  try {

    const email = process.env.SUPERADMIN_EMAIL;
    const name = process.env.SUPERADMIN_NAME;
    const password = process.env.SUPERADMIN_PASSWORD;

    // check existing
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("SuperAdmin already exists");
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name,email,password,role)
       VALUES (?,?,?,?)`,
      [
        name,
        email,
        hashedPassword,
        "SUPER_ADMIN"
      ]
    );

    console.log("SuperAdmin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit();

  }

};

createSuperAdmin();