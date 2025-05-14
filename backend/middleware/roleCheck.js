import Staff from '../models/Staff.js';

export const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user?.id) {
        return res.status(403).json({ error: 'Access denied - not authenticated' });
      }
      
      // Get user with role from database
      const staff = await Staff.findById(req.user.id).populate('role_id', 'role_name');
      
      // For debugging
      console.debug(`Role check for user ${req.user.id}: ${staff?.role_id?.role_name || 'No role'}`);
      
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }
      
      if (!staff.role_id) {
        return res.status(403).json({ error: 'No role assigned to this staff member' });
      }
      
      // Get the role name from the populated role_id field
      const roleName = staff.role_id.role_name;
      
      if (!allowedRoles.includes(roleName)) {
        console.debug(`Access denied for ${roleName}. Required: [${allowedRoles.join(', ')}]`);
        return res.status(403).json({ 
          error: `Insufficient permissions. Required: [${allowedRoles.join(', ')}]` 
        });
      }
      
      // Add role to req.user for convenience in other middlewares
      req.user.role = roleName;
      
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Server error in role verification' });
    }
  };
};