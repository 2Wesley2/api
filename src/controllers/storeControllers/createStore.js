const Store = require('../../models/Store');
const Profile = require('../../models/Profile');
const generateHttpError = require('../../utils/generateHttpError');

exports.createStore = async (req, res, next) => {
  const { storeName, storeAddress, storeContact } = req.body;
  const profileId = req.user.profile.id;
  const session = req.session;

  try {
    if (!profileId) {
      return next(generateHttpError(401, 'Usuário não autenticado'));
    }

    const existingStore = await Store.findOne({ storeName, storeAddress })
      .session(session)
      .lean();
    if (existingStore) {
      return next(
        generateHttpError(
          400,
          'Uma loja com o mesmo nome e endereço já existe',
        ),
      );
    }

    const storeData = {
      storeName,
      storeAddress,
      storeContact,
      profile: profileId,
    };

    const newStore = new Store(storeData);
    const saveStorePromise = newStore.save({ session });
    const updateProfilePromise = Profile.findByIdAndUpdate(
      profileId,
      { $push: { stores: newStore._id } },
      { session },
    );

    await Promise.all([saveStorePromise, updateProfilePromise]);

    res.locals.successResponse = {
      status: 201,
      message: 'Loja criada com sucesso',
    };

    next();
  } catch (error) {
    console.error('Erro ao criar loja:', error);
    next(generateHttpError(500, 'Erro ao criar loja', error));
  }
};
