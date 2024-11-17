const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const noteRoutes = require('./routes/NoteRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;


 const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to Itzik API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

