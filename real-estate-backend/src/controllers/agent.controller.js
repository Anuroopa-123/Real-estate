const agentService = require("../services/agent.service");

exports.createAgent = async (req, res) => {

  try {

    const agent = await agentService.createAgent(req.body);

    res.status(201).json({
      success: true,
      data: agent
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};

exports.getAgents = async (req, res) => {

  const agents = await agentService.getAgents();

  res.json({
    success: true,
    data: agents
  });

};

exports.deleteAgent = async (req,res)=>{

  await agentService.deleteAgent(req.params.id);

  res.json({
    success:true,
    message:"Agent deleted"
  });

};