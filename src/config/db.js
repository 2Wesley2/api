const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log('String de Conexão:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log('Conectou');
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
