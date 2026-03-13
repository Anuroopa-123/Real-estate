const bcrypt = require("bcrypt");
const agentRepository = require("../repositories/agent.repository");

exports.createAgent = async (body) => {

  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const hashed = await bcrypt.hash(password, 10);

  return agentRepository.createAgent({
    name,
    email,
    password: hashed
  });

};

exports.getAgents = async () => {

  return agentRepository.findAgents();

};

exports.deleteAgent = async (id) => {

  await agentRepository.deleteAgent(id);

};