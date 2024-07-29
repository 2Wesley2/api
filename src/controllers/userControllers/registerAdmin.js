const RolePermission = require('../../models/RolePermission.js');
const {
  createPerson,
  createUser,
  createUserPermission,
  createProfile,
} = require('../../service/user/userService.js');
require('dotenv').config();
const validateParams = require('../../utils/validateParams');
const generateHttpError = require('../../utils/generateHttpError');

exports.registerAdmin = async (req, res, next) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
  const { role } = req;
  const session = req.session;

  try {
    validateParams({
      email,
      password,
      phone,
      cpf,
      firstName,
      lastName,
      birthDate,
      role,
    });

    const rolePermissions = await RolePermission.findOne({ role })
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
      role,
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
      message: 'Administrador registrado com sucesso',
    };
    next();
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    next(generateHttpError(500, 'Erro ao criar administrador', error));
  }
};
