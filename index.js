const express = require('express');
const mongoose = require('mongoose');
const userNoteRoutes = require('./routes/UserNotesRoutes');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;


 const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', userNoteRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Itzik API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

