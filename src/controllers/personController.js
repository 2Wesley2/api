const Person = require('../models/Person');

exports.createPerson = async (req, res) => {
  try {
    const { name, phone, email, role } = req.body;
    const newPerson = new Person({ name, phone, email, role });
    await newPerson.save();
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pessoa', error });
  }
};

exports.getPeople = async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter pessoas', error });
  }
};

exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter pessoa', error });
  }
};

exports.updatePerson = async (req, res) => {
  try {
    const { name, phone, email, role } = req.body;
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, role },
      { new: true, runValidators: true },
    );
    if (!person) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pessoa', error });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    res.status(200).json({ message: 'Pessoa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar pessoa', error });
  }
};
