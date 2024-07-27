const User = require('../../models/User');
const Profile = require('../../models/Profile');
const bcrypt = require('bcryptjs');
const Person = require('../../models/Person');
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
  const newProfile = new Profile({ user: userId, stores: [] });
  await newProfile.save({ session });
  return newProfile;
};

module.exports = {
  createPerson,
  createUser,
  createUserPermission,
  createProfile,
};
