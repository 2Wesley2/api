const Person = require('../models/Person');

exports.createPerson = async ({ cpf, firstName, lastName, birthDate }) => {
  try {
    let person = await Person.findOne({ cpf: cpf }).lean();
    if (person) {
      throw new Error('CPF já cadastrado');
    }
    person = new Person({ cpf, firstName, lastName, birthDate });
    await person.save();
    return person._id;
  } catch (error) {
    console.error('Erro ao criar pessoa:', error.message);
    throw new Error('Erro ao criar pessoa');
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
