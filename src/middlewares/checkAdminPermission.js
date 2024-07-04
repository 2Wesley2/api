const User = require('../models/User');
const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');
const Permission = require('../models/Permission');

const checkAdminPermission = async (req, res, next) => {
  const userId = req.id;
  const requiredPermission = 'register_admin';

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'rolePermission',
        model: RolePermission,
        populate: [
          {
            path: 'role',
            select: 'roleName',
            model: Role,
            match: { roleName: 'admin' },
          },
          {
            path: 'permissions',
            select: 'permissionName',
            model: Permission,
          },
        ],
      })
      .lean();

    const { rolePermission } = user;
    if (!user || !rolePermission.role || !user.rolePermission) {
      return res.status(403).json({ message: 'Permissões insuficientes' });
    }

    const isAdmin = user.rolePermission.role.roleName === 'admin';
    const hasPermission = user.rolePermission.permissions.some(
      (permission) => permission.permissionName === requiredPermission,
    );

    if (isAdmin && hasPermission) {
      req.rolePermission = rolePermission;
      next();
    } else {
      return res.status(403).send('Permissão negada');
    }
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao verificar papel do usuário',
      error: error.message,
    });
  }
};

module.exports = checkAdminPermission;
