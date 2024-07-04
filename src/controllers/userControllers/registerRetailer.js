const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { createPerson } = require('../personController');
const RolePermission = require('../../models/RolePermission');
require('dotenv').config();

const validateRolePermission = async () => {
  const errors = [];
  const retailerRoleId = process.env.RETAILER_ROLE_ID;

  if (!retailerRoleId) {
    errors.push({ msg: 'Role ID not configured', status: 500 });
  } else {
    const retailerRolePermission = await RolePermission.findOne({
      role: retailerRoleId,
    }).lean();
    if (!retailerRolePermission) {
      errors.push({ msg: 'RolePermission not found', status: 404 });
    }
  }

  return errors.filter(Boolean);
};

exports.registerRetailer = async (req, res) => {
  const { email, password, phone, cpf, firstName, lastName, birthDate } =
    req.body;

  try {
    const errors = await validateRolePermission();

    if (errors.length > 0) {
      // Retorna todas as mensagens de erro e os status correspondentes
      const highestStatus = errors.reduce(
        (highest, error) => Math.max(highest, error.status),
        400,
      );
      return res.status(highestStatus).json({
        messages: errors.map((e) => e.msg),
        statusCodes: errors.map((e) => e.status),
      });
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
      rolePermission: process.env.RETAILER_ROLE_ID,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};
