const Store = require('../models/Store');

exports.createStore = async (req, res) => {
  const { name, address, contact, people } = req.body;
  try {
    const newStore = new Store({ name, address, contact, people });
    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter lojas', error });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter loja', error });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { name, address, contact, people } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { name, address, contact, people },
      { new: true, runValidators: true }
    );
    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar loja', error });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada' });
    }
    res.status(200).json({ message: 'Loja deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar loja', error });
  }
};