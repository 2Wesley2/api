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

PersonSchema.index({ firstName: 1, lastName: 1 });
PersonSchema.index({ cpf: 1 });

module.exports = mongoose.model('Person', PersonSchema);
