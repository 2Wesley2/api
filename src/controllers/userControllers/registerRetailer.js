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
const debug = require('debug')('app:registerRetailer');

exports.registerRetailer = async (req, res, next) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
  const session = req.session;
  const retailerRoleId = process.env.ROLE_RETAILER_ID;

  try {
    debug('Validating request parameters');
    validateParams({
      email,
      password,
      phone,
      cpf,
      firstName,
      lastName,
      birthDate,
    });

    debug('Finding role permissions for retailer role');
    const rolePermissionsPromise = await RolePermission.findOne({
      role: retailerRoleId,
    })
      .session(session)
      .lean()
      .select('permissions');

    debug('Creating new person record');
    const newPersonPromise = await createPerson(
      cpf,
      firstName,
      lastName,
      birthDate,
      session,
    );
    const [rolePermissions, newPerson] = await Promise.all([
      rolePermissionsPromise,
      newPersonPromise,
    ]);

    if (!rolePermissions) {
      debug('Role permissions not found');
      return next(generateHttpError(400, 'Permissões do role não encontradas'));
    }

    debug('Creating new user record');
    const newUser = await createUser(
      email,
      password,
      phone,
      newPerson._id,
      retailerRoleId,
      session,
    );

    debug('Extracting permissions from role permissions');
    const permissions = rolePermissions.permissions.map(
      (p) => p.permissionName,
    );
    debug('Creating user permissions and profile');
    await Promise.all([
      createUserPermission(newUser._id, permissions, session),
      createProfile(newUser._id, session),
    ]);
    res.locals.successResponse = {
      status: 201,
      message: 'Usuário registrado com sucesso',
    };
    debug('User registration successful');
    next();
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    debug(`Error during user registration: ${error.message}`);
    next(generateHttpError(500, 'Erro ao registrar usuário', error));
  }
};
