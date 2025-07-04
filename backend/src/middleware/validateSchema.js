function validateSchema(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: e.errors });
    }
  };
}

module.exports = validateSchema; 