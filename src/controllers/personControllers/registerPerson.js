const Person = require('../../models/Person');

exports.registerPerson = async (
  { cpf, firstName, lastName, birthDate },
  session,
) => {
  try {
    let person = await Person.findOne({ cpf: cpf }).lean().session(session);
    if (person) {
      throw new Error('CPF já cadastrado');
    }
    person = new Person({ cpf, firstName, lastName, birthDate });
    await person.save({ session });
    return person;
  } catch (error) {
    console.error('Erro ao criar pessoa:', error.message);
    throw new Error('Erro ao criar pessoa');
  }
};
