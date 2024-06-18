const Store = require('../models/Store');

const createStore = async (req, res) => {
  const { name, address, contact } = req.body;
  try {
    const newStore = new Store({ name, address, contact });
    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}