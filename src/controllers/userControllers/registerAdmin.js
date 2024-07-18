const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const { registerPerson } = require('../personControllers/registerPerson.js');
require('dotenv').config();

exports.registerAdmin = async (req, res) => {
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
    await newUser.save({ session });
    res.status(201).json({ message: 'Administrador registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar administrador:', error.message);
    res.status(500).json({ message: 'Erro ao criar administrador', error });
  }
};
