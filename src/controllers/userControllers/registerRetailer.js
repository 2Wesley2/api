const RolePermission = require('../../models/RolePermission');
const validateParams = require('../../utils/validateParams');
const {
  createPerson,
  createUser,
  createUserPermission,
  createProfile,
} = require('../../service/user/userService.js');
require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');

exports.registerRetailer = async (req, res, next) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
  const session = req.session;
  const retailerRoleId = process.env.ROLE_RETAILER_ID;

  try {
    validateParams({
      email,
      password,
      phone,
      cpf,
      firstName,
      lastName,
      birthDate,
    });

    const rolePermissions = await RolePermission.findOne({
      role: retailerRoleId,
    })
      .session(session)
      .lean()
      .select('permissions');

    if (!rolePermissions) {
      return next(generateHttpError(400, 'Permissões do role não encontradas'));
    }

    const newPerson = await createPerson(
      cpf,
      firstName,
      lastName,
      birthDate,
      session,
    );

    const newUser = await createUser(
      email,
      password,
      phone,
      newPerson._id,
      retailerRoleId,
      session,
    );

    const permissions = rolePermissions.permissions.map(
      (p) => p.permissionName,
    );

    const userPermissionPromise = createUserPermission(
      newUser._id,
      permissions,
      session,
    );

    const profilePromise = createProfile(newUser._id, session);
    await Promise.all([userPermissionPromise, profilePromise]);
    res.locals.successResponse = {
      status: 201,
      message: 'Usuário registrado com sucesso',
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    next(generateHttpError(500, 'Erro ao registrar usuário', error));
  }
};
