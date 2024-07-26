const User = require('../../models/User.js');
const Profile = require('../../models/Profile.js');
const bcrypt = require('bcryptjs');
const Person = require('../../models/Person.js');
const UserPermission = require('../../models/UserPermission.js');
const RolePermission = require('../../models/RolePermission.js');

require('dotenv').config();
const validateParams = require('../../utils/validateParams');
const generateHttpError = require('../../utils/generateHttpError');

exports.registerAdmin = async (req, res, next) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
  const { role } = req;
  const session = req.session;

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

  try {
    const existingPerson = await Person.findOne({ cpf }).session(session);
    if (existingPerson) {
      return next(generateHttpError(400, 'CPF já cadastrado'));
    }
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return next(generateHttpError(500, 'Erro ao verificar CPF', error));
  }

  // Verificar se as permissões da função estão disponíveis
  let rolePermissions;
  try {
    rolePermissions = await RolePermission.findOne({ role })
      .session(session)
      .lean()
      .select('permissions');

    if (!rolePermissions) {
      return next(generateHttpError(400, 'Permissões do role não encontradas'));
    }
  } catch (error) {
    console.error('Erro ao verificar permissões do role:', error);
    return next(
      generateHttpError(500, 'Erro ao verificar permissões do role', error),
    );
  }

  try {
    const newPerson = new Person({ cpf, firstName, lastName, birthDate });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: newPerson._id,
      role: role,
    });

    const permissions = rolePermissions.permissions.map(
      (p) => p.permissionName,
    );

    const newUserPermission = new UserPermission({
      userId: newUser._id,
      permissions: permissions,
    });

    const newProfile = new Profile({
      user: newUser._id,
      stores: [],
    });

    await Promise.all([
      newPerson.save({ session }),
      newUser.save({ session }),
      newUserPermission.save({ session }),
      newProfile.save({ session }),
    ]);

    res.status(201).json({ message: 'Administrador registrado com sucesso' });
    next();
  } catch (error) {
    console.error('Erro ao criar administrador:', error);

    next(generateHttpError(500, 'Erro ao criar administrador', error));
  }
};
