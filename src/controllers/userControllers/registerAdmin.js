const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const { registerPerson } = require('../personControllers/registerPerson.js');
const {
  registerUserPermissions,
} = require('../permissionControllers/registerUserPermissions.js');

require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');

exports.registerAdmin = async (req, res, next) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
  const { role } = req;
  const session = req.session;
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

    await registerUserPermissions(newUser._id, role, session);
    await newUser.save({ session });
    res.status(201).json({ message: 'Administrador registrado com sucesso' });
  } catch (error) {
    next(generateHttpError(500, 'Erro ao criar administrador', error));
  }
};
