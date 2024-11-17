const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const noteRoutes = require('./routes/NoteRoutes');

const app = express();
const PORT = process.env.PORT || 8080;


const mongoUri = 'mongodb+srv://itziktempleman:ous0KAHcRTrDH9fe@notes-app-cluster.qg3k0.mongodb.net/notesApp?retryWrites=true&w=majority';

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', noteRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to Itzik API');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});