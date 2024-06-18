const Profile = require('../models/Profile');

exports.createProfile = async (req, res) => {
  try {
    const { user, store, name, surname, contact, email, permissions } = req.body;
    const newProfile = new Profile({ user, store, name, surname, contact, email, permissions });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar perfil', error });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter perfis', error });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter perfil', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { user, store, name, surname, contact, email, permissions } = req.body;
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { user, store, name, surname, contact, email, permissions },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }
    res.status(200).json({ message: 'Perfil deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar perfil', error });
  }
};
