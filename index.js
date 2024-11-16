const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');  // Import user routes
const noteRoutes = require('./routes/NoteRoutes');  // Import note routes

const app = express();
const PORT = 8080;

// MongoDB Atlas connection string
const mongoUri = 'mongodb+srv://itziktempleman:ous0KAHcRTrDH9fe@notes-app-cluster.qg3k0.mongodb.net/notesApp?retryWrites=true&w=majority';

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());  // Allow JSON payloads

app.use('/api', userRoutes);  // Register user routes under /api
app.use('/api', noteRoutes);  // Register note routes under /api

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Itzik API');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});