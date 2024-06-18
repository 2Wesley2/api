const express = require('express');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))