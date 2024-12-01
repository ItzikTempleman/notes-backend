const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const { v4: uuidv4 } = require('uuid');
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
    const {email, password} = req.query;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required.'});
    }
    try {
        const user = await User.findOne({email, password});
        if (!user) {
            return res.status(404).json({error: 'Invalid email or password'});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({error: 'Server error, please try again later.'});
    }
});

router.put('/update', async (req, res) => {
    const {email, phoneNumber, profileImage, userId} = req.query;
    if (!userId) {
        return res.status(400).json({error: 'User ID is required to update user information.'});
    }
    try {
        const updateFields = {};
        if (email) updateFields.email = email;
        if (phoneNumber) updateFields.phonenUmber = phoneNumber;
        if (profileImage) updateFields.phonenumber = phoneNumber;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({error: 'At least one field (email, phoneNumber, profileImage) must be provided to update'});
        }

        const updatedUser = await User.findOneAndUpdate(
            {userId},
            {$set: updateFields},
            {new: true}
        );
        if (!updatedUser) {
            return res.status(400).json({error: 'User not found'})
        }

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({error: 'Server error, please try again later'});
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
            res.json({message: 'User deleted successfully', user: deletedUser});
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }
);

//Notes
router.post('/notes/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { noteId, content, time, isInTrash, isStarred, isPinned, fontColor, fontSize, fontWeight } = req.body;

    if (!noteId || typeof noteId !== 'number') {
        return res.status(400).json({ error: "noteId is required and must be a number." });
    }
    if (!content) {
        return res.status(400).json({ error: "Content is required." });
    }

    try {
        const existingNote = await Note.findOne({ userId, noteId });
        if (existingNote) {
            return res.status(409).json({ error: "Duplicate noteId error. This noteId already exists for this user." });
        }

        const newNote = new Note({
            noteId,
            userId,
            content,
            time: time || new Date().toISOString(),
            isInTrash,
            isStarred,
            isPinned,
            fontColor,
            fontSize,
            fontWeight
        });

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        console.error("Error saving the note:", err);
        res.status(500).json({ error: "Server error, please try again later.", details: err });
    }
});

router.get('/notes/user/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    console.log("Fetching notes for userId:", userId);

    try {
        const notes = await Note.find({ userId });
        if (notes.length === 0) {
            console.warn("No notes found for userId:", userId);
        } else {
            console.log("Notes retrieved:", notes);
        }
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes for userId:", userId, err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;