exports.isSuperAdmin = (req, res, next) => {
  if (req.user?.role === 'SUPER_ADMIN') return next();
  return res.status(403).json({ success: false, message: 'SuperAdmin access required' });
};
 
exports.isAdmin = (req, res, next) => {
  if (['SUPER_ADMIN', 'ADMIN'].includes(req.user?.role)) return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};
 
exports.isAgent = (req, res, next) => {
  if (['SUPER_ADMIN', 'ADMIN', 'AGENT'].includes(req.user?.role)) return next();
  return res.status(403).json({ success: false, message: 'Agent access required' });
};
 