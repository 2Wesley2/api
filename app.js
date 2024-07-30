const express = require('express');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const storeRoutes = require('./src/routes/storeRoutes');
const errorHandler = require('./src/middlewares/error/handleErrors');

dotenv.config();

const app = express();

// Conecta ao banco de dados
connectDB();

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoutes);

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de lojas
app.use('/api/store', storeRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
