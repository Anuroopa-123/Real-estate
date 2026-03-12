exports.validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(422).json({ success: false, message: "Validation failed", errors: messages });
  }
  next();
};