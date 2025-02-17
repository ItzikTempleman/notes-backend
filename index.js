const express = require('express');
const mongoose = require('mongoose');
const userNoteTaskRoutes = require('./routes/UserNotesTasksRoutes');
const path = require('path'); // Import the path module

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use your API routes
app.use('/api', userNoteTaskRoutes);

// Optional: Serve the HTML file for the root route or others if needed
app.get('/', (req, res) => {
    res.send('Users-notes-tasks backend');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});