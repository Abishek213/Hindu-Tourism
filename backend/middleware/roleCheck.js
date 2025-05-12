exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.role_name)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role.role_name} is not authorized to access this route`,
      });
    }
    next();
  };
};