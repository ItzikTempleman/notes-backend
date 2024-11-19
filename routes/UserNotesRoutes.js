const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');

//Users

router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
})


router.get('/users/:userId', async (req, res) => {
        try {
            const user = await User.findOne(
                {
                    userId: req.params.userId
                });
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }
);

router.get('/authenticate', async (req, res) => {
    const { email, password } = req.query;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(404).json({ error: 'Invalid email or password' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/users/:userId', async (req, res) => {
        try {
            const deletedUser = await User.findOneAndDelete(
                {
                    userId: req.params.userId
                });
            if (!deletedUser) {
                return res.status(404).json({error: 'User not found'});
            }
            res.json({ message: 'User deleted successfully', user: deletedUser });
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }
);


//Notes

router.post('/notes', async (req, res) => {
    if (req.body.noteId === 0) {
        req.body.noteId = Math.floor(Math.random() * 1000000);
    }
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});


router.get('/notes/user/:userId', async (req, res) => {
        try {
            const notes = await Note.find(
                {userId: req.params.userId}
            );
            res.json(notes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);


module.exports = router;