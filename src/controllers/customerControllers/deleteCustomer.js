const Store = require('../../models/Store');
const Customer = require('../../models/Customer');
const Person = require('../../models/Person');
const generateHttpError = require('../../utils/generateHttpError');

const deleteCustomer = async (req, res, next) => {
  const { storeId, customerId } = req.params;
  const { profile } = req.user;
  const session = req.session;

  try {
    const store = profile.stores.find((store) => store.id === storeId);
    if (!store) {
      return next(generateHttpError(403, 'Acesso negado à loja especificada'));
    }

    const [storeExists, customer] = await Promise.all([
      Store.findById(storeId).session(session),
      Customer.findById(customerId).session(session),
    ]);

    const checks = [
      {
        condition: !storeExists,
        error: generateHttpError(404, 'Loja não encontrada'),
      },
      {
        condition: !customer,
        error: generateHttpError(404, 'Cliente não encontrado'),
      },
      {
        condition: !storeExists.customers.includes(customerId),
        error: generateHttpError(
          403,
          'Cliente não pertence à loja especificada',
        ),
      },
    ];

    for (const check of checks) {
      if (check.condition) {
        return next(check.error);
      }
    }

    const personId = customer.person;
    await Promise.all([
      Store.findByIdAndUpdate(storeId, {
        $pull: { customers: customerId },
      }).session(session),
      Person.findByIdAndDelete(personId).session(session),
      Customer.findByIdAndDelete(customerId).session(session),
    ]);

    res.locals.successResponse = {
      status: 200,
      message: 'Cliente deletado com sucesso',
    };

    next();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    next(generateHttpError(500, 'Erro ao deletar cliente', error));
  }
};

module.exports = deleteCustomer;
