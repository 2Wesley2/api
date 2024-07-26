const express = require('express');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middlewares/error/handleErrors');
dotenv.config();

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());

app.use('/users', userRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
