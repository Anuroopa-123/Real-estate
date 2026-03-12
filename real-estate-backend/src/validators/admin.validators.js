const Joi = require("joi");
 
exports.createUserSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role:     Joi.string().valid("ADMIN", "AGENT", "BUYER").required(),
  status:   Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  phone:    Joi.string().pattern(/^\+?[0-9]{7,15}$/).optional().allow("", null),
});
 
exports.updateUserSchema = Joi.object({
  name:   Joi.string().trim().min(2).max(100).optional(),
  email:  Joi.string().email().optional(),
  role:   Joi.string().valid("ADMIN", "AGENT", "BUYER").optional(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
  phone:  Joi.string().pattern(/^\+?[0-9]{7,15}$/).optional().allow("", null),
}).min(1);