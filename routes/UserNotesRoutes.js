const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const { v4: uuidv4 } = require('uuid');

// ----------------------------------------
// USERS ENDPOINTS
// ----------------------------------------

/**
 * Create a new user
 */
router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Error creating user:", err.message);
        res.status(400).json({ error: err.message });
    }
});

/**
 * Get all users
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get a user by ID
 */
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------
// NOTES ENDPOINTS
// ----------------------------------------

/**
 * Create or update a note for a user
 */
router.post('/notes/user/:userId', async (req, res) => {
    console.log("POST /notes/user/:userId");
    console.log("Request Body:", req.body);

    const { noteId, content } = req.body;
    const userId = req.params.userId.trim();

    // Validate request
    if (!noteId || !content) {
        console.error("Invalid request: Missing noteId or content");
        return res.status(400).json({ error: "Missing required fields: noteId and content" });
    }

    try {
        // Check if the user exists
        const userExists = await User.findOne({ userId });
        if (!userExists) {
            return res.status(404).json({ error: `User with ID ${userId} not found.` });
        }

        // Create or update the note
        const savedNote = await Note.findOneAndUpdate(
            { noteId }, // Match existing note by noteId
            {
                noteId,
                content,
                userId,
                time: new Date().toISOString(),
            },
            { upsert: true, new: true } // Insert if not found, return updated/inserted note
        );

        console.log("Note saved successfully:", savedNote);
        res.status(201).json(savedNote);
    } catch (err) {
        console.error("Error saving note:", err.message);
        res.status(500).json({ error: "Server error, please try again later." });
    }
});

/**
 * Fetch all notes for a user
 */
router.get('/notes/user/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    console.log("Fetching notes for userId:", userId);

    try {
        const notes = await Note.find({ userId });
        console.log("Notes retrieved:", notes);
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------
// EXPORT ROUTER
// ----------------------------------------
module.exports = router;