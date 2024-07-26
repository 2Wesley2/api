const User = require('../../models/User.js');
const Profile = require('../../models/Profile.js');
const bcrypt = require('bcryptjs');
const { registerPerson } = require('../../service/person/registerPerson.js');
const {
  registerUserPermissions,
} = require('../../service/permission/registerUserPermissions.js');

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
    const person = await registerPerson(
      {
        cpf,
        firstName,
        lastName,
        birthDate,
      },
      session,
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: person._id,
      role: role,
    });

    const newUserPermission = await registerUserPermissions(
      newUser._id,
      role,
      session,
    );

    const newProfile = new Profile({
      user: newUser._id,
      stores: [],
    });

    await Promise.all([
      person.save({ session }),
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
