const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Store = require('../../models/Store');
const bcrypt = require('bcryptjs');
const Person = require('../../models/Person');
const UserPermission = require('../../models/UserPermission');
const RolePermission = require('../../models/RolePermission');
const validateParams = require('../../utils/validateParams');

require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');

exports.registerRetailer = async (req, res, next) => {
  const {
    email,
    password,
    phone,
    cpf,
    firstName,
    lastName,
    birthDate,
    storeName,
    storeAddress,
    storeContact,
  } = req.body;
  const session = req.session;
  const retailerRoleId = process.env.ROLE_RETAILER_ID;

  validateParams({
    email,
    password,
    phone,
    cpf,
    firstName,
    lastName,
    birthDate,
    storeName,
    storeAddress,
    storeContact,
  });
  // Verificar se a pessoa já está cadastrada
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
    rolePermissions = await RolePermission.findOne({ role: retailerRoleId })
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
    const retailerRoleId = process.env.ROLE_RETAILER_ID;

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: newPerson._id,
      role: retailerRoleId,
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

    const newStore = new Store({
      storeName,
      storeAddress,
      storeContact,
      profile: newProfile._id,
    });

    newProfile.stores.push(newStore._id);

    await Promise.all([
      newPerson.save({ session }),
      newUser.save({ session }),
      newUserPermission.save({ session }),
      newProfile.save({ session }),
      newStore.save({ session }),
    ]);

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    next(generateHttpError(500, 'Erro ao criar usuário', error));
  }
};
