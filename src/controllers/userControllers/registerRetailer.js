const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { registerPerson } = require('../personControllers/registerPerson');
require('dotenv').config();

exports.registerRetailer = async (req, res) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;

  try {
    const personId = await registerPerson({
      cpf,
      firstName,
      lastName,
      birthDate,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const retailerRoleId = process.env.ROLE_RETAILER_ID;

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: personId,
      role: retailerRoleId,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};
