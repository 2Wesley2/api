const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');
require('dotenv').config();

const checkRoleAndPermission = async (req, res, next) => {
  try {
    const { role } = req.body;

    const validRoles = process.env.VALID_ROLES.split(',');
    if (!validRoles.includes(role)) {
      return res.status(404).json({
        message: 'Função inexistente',
      });
    }

    const roleDocument = await Role.findById({ roleName: role }).lean();
    if (!roleDocument) {
      return res.status(404).json({ message: 'Função não encontrada' });
    }

    const rolePermission = await RolePermission.findOne({
      role: roleDocument._id,
    })
      .populate('permissions')
      .lean();
    if (!rolePermission) {
      return res.status(403).json({
        message: 'O usuário não tem esta permissão',
      });
    }

    req.rolePermission = rolePermission;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao verificar a função e permissão', error });
  }
};

module.exports = checkRoleAndPermission;
