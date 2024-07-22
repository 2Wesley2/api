const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { registerPerson } = require('../personControllers/registerPerson');
const {
  registerUserPermissions,
} = require('../permissionControllers/registerUserPermissions');

require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');

exports.registerRetailer = async (req, res, next) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
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
    const retailerRoleId = process.env.ROLE_RETAILER_ID;

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: person._id,
      role: retailerRoleId,
    });

    await newUser.save({ session });

    await registerUserPermissions(newUser._id, retailerRoleId, session);
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    next(generateHttpError(500, 'Erro ao criar usuário', error));
  }
};
