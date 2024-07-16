const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { createPerson } = require('../personController');
require('dotenv').config();

exports.registerAdmin = async (req, res) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;
  const { role } = req.role;

  try {
    const personId = await createPerson({
      cpf,
      firstName,
      lastName,
      birthDate,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: personId,
      role: role,
    });

    await newUser.save();
    res.status(201).json({ message: 'Administrador registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar administrador:', error.message);
    res.status(500).json({ message: 'Erro ao criar administrador', error });
  }
};
