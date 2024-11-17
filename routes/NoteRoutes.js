const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


router.post('/notes', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/notes/user/:userId', async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.params.userId });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/notes/:noteId', async (req, res) => {
    try {
        const note = await Note.findOne({ noteId: req.params.noteId });
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;