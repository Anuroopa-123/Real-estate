exports.paginate = (page = 1, limit = 10) => ({
  offset: (Math.max(1, page) - 1) * Math.max(1, limit),
  limit: Math.min(100, Math.max(1, limit)),
});