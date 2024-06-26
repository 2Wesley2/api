const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkPermission } = require('../helpers/permissionHelpers');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, phone, person, role } = req.body;

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: 'Por favor, forneça um email ou um telefone.' });
    }

    const userRole = await Role.findById(role).lean();
    if (!userRole) {
      return res.status(400).json({ message: 'Função inválida' });
    }

    if (userRole.roleName === 'admin') {
      const isAdmin = await checkPermission(req.user.id, 'admin');
      if (!isAdmin) {
        return res.status(403).json({
          message: 'Apenas administradores podem criar outros administradores.',
        });
      }
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { person }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email, telefone ou pessoa já cadastrados.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      person,
      role: userRole._id,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: 'Por favor, forneça um email ou um telefone.' });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] })
      .populate('role')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuários', error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuário', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { email, password } = req.body;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (email) {
      user.email = email;
    }
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    await user.remove();
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
};
