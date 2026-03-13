const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/property.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.use(verifyToken);

router.get("/", propertyController.getProperties);
router.post("/", propertyController.createProperty);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;