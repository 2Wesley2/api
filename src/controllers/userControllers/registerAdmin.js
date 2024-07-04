const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { createPerson } = require('../personController');

exports.registerAdmin = async (req, res) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;

  try {
    const adminRolePermission = req.rolePermission;
    if (!adminRolePermission || !adminRolePermission.role) {
      return res.status(400).json({ msg: 'Função não encontrada.' });
    }
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
      rolePermission: adminRolePermission._id,
    });
    await newUser.save();
    res.status(201).json({ message: 'Administrador registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar administrador:', error.message);
    res.status(500).json({ message: 'Erro ao criar administrador', error });
  }
};
