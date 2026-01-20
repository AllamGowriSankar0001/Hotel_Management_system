const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userRole = req.user.role.toLowerCase();
    const roles = allowedRoles.map(role => role.toLowerCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
