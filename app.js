const express = require('express');
const connectDB = require('./src/config/db');


const userRoutes = require('./src/routes/userRoutes');
const personRoutes = require('./src/routes/personRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const storeRoutes = require('./src/routes/storeRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/people', personRoutes);
app.use('/profiles', profileRoutes);
app.use('/stores', storeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));