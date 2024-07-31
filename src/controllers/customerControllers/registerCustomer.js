const {
  createPerson,
  updateStoreWithCustomer,
  createCustomer,
} = require('../../service/user/userService.js');
const validateParams = require('../../utils/validateParams');
const generateHttpError = require('../../utils/generateHttpError');

const registerCustomer = async (req, res, next) => {
  const { storeId } = req.params;
  const { cpf, firstName, lastName, birthDate } = req.body;
  const { profile } = req.user;
  const session = req.session;

  try {
    validateParams({ storeId, cpf, firstName, lastName, birthDate });
    const store = profile.stores.find((store) => store.id === storeId);
    if (!store) {
      return next(generateHttpError(403, 'Acesso negado à loja especificada'));
    }

    const person = await createPerson(
      cpf,
      firstName,
      lastName,
      birthDate,
      session,
    );
    const customer = await createCustomer(person._id, session);
    await updateStoreWithCustomer(storeId, customer._id, session);

    res.locals.successResponse = {
      status: 201,
      message: 'Cliente registrado com sucesso',
    };
    next();
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    next(generateHttpError(500, 'Erro ao registrar cliente', error));
  }
};
module.exports = registerCustomer;
