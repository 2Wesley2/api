const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema(
  {
    cpf: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Person', PersonSchema);
