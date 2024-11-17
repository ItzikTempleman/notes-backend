const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


router.post('/', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



module.exports = router;