const User = require('../../models/User');

const checkAdminPermission = async (req, res, next) => {
  const userId = req.id;
  const requiredPermission = 'register_admin';
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'rolePermission',
        populate: [
          {
            path: 'role',
            select: 'roleName',
            model: 'Role',
          },
          {
            path: 'permissions',
            select: 'permissionName',
            model: 'Permission',
          },
        ],
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const rolePermission = user.rolePermission;
    const isAdmin = rolePermission.role.roleName === 'admin';
    const hasPermission = rolePermission.permissions.some(
      (permission) => permission.permissionName === requiredPermission,
    );

    if (isAdmin && hasPermission) {
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
