const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Person = require('../../models/Person');
const Store = require('../../models/Store');
const Customer = require('../../models/Customer');
const UserPermission = require('../../models/UserPermission');
const generateHttpError = require('../../utils/generateHttpError');

const createPerson = async (cpf, firstName, lastName, birthDate, session) => {
  const existingPerson = await Person.findOne({ cpf }).session(session);
  if (existingPerson) {
    throw generateHttpError(400, 'CPF já cadastrado');
  }
  const newPerson = new Person({ cpf, firstName, lastName, birthDate });
  await newPerson.save({ session });
  return newPerson;
};

const createUser = async (email, password, phone, personId, role, session) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  }).session(session);

  if (existingUser) {
    if (existingUser.email === email) {
      throw generateHttpError(400, 'Email já cadastrado');
    }
    if (existingUser.phone === phone) {
      throw generateHttpError(400, 'Telefone já cadastrado');
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
    phone,
    person: personId,
    role: role,
  });
  await newUser.save({ session });
  return newUser;
};

const createUserPermission = async (userId, permissions, session) => {
  const newUserPermission = new UserPermission({
    userId: userId,
    permissions: permissions,
  });
  await newUserPermission.save({ session });
};

const createProfile = async (userId, session) => {
  const existingProfile = await Profile.findOne({ user: userId }).session(
    session,
  );
  if (existingProfile) {
    throw generateHttpError(400, 'Perfil já cadastrado para este usuário');
  }
  const newProfile = new Profile({ user: userId, stores: [] });
  await newProfile.save({ session });
  return newProfile;
};

const createCustomer = async (personId, session) => {
  const existingCustomer = await Customer.findOne({ person: personId }).session(
    session,
  );
  if (existingCustomer) {
    throw generateHttpError(400, 'Cliente já cadastrado');
  }
  const customer = new Customer({ person: personId });
  await customer.save({ session });
  return customer;
};

const updateStoreWithCustomer = async (storeId, customerId, session) => {
  const store = await Store.findById(storeId).session(session);
  if (!store) {
    throw generateHttpError(404, 'Loja não encontrada');
  }
  store.customers.push(customerId);
  await store.save({ session });
  return store;
};

module.exports = {
  createPerson,
  createUser,
  createUserPermission,
  createProfile,
  createCustomer,
  updateStoreWithCustomer,
};
