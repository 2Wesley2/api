const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { createPerson } = require('../personController');
const RolePermission = require('../../models/RolePermission');

exports.registerRetailer = async (req, res) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;

  try {
    const retailerRolePermission = await RolePermission.findOne({
      'role.roleName': 'retailer',
    }).lean();

    if (!retailerRolePermission) {
      return res.status(400).json({ msg: 'Role not found' });
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
      rolePermission: retailerRolePermission._id,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};
