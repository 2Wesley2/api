const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { createPerson } = require('./personController');
const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');

exports.registerRetailer = async (req, res) => {
  try {
    const { email, password, phone, cpf, firstName, lastName, birthDate } =
      req.body;

    const role = await Role.findOne({ roleName: 'retailer' }).lean();
    if (!role) {
      return res.status(400).json({ msg: 'Role retailer not found' });
    }

    const rolePermission = await RolePermission.findOne({
      role: role._id,
    }).lean();
    if (!rolePermission) {
      return res
        .status(400)
        .json({ msg: 'RolePermission for retailer not found' });
    }

    const personData = {
      cpf,
      firstName,
      lastName,
      birthDate,
    };

    let person;
    try {
      person = await createPerson(personData);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person: person._id,
      rolePermission: rolePermission._id,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};
