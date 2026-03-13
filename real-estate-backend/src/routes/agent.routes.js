const express = require("express");
const router = express.Router();

const agentController = require("../controllers/agent.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.use(verifyToken);

router.get("/", agentController.getAgents);

router.post("/", agentController.createAgent);

router.delete("/:id", agentController.deleteAgent);

module.exports = router;