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

router.post('/notes', async (req, res) => {
    const { noteId, content, userId } = req.body;

    if (!Number.isInteger(noteId) || noteId <= 0) {
        return res.status(400).json({ error: "Invalid or missing noteId. Must be a positive integer." });
    }

    if (!content || !userId) {
        return res.status(400).json({ error: "Missing required fields: content and userId." });
    }

    try {
        const existingNote = await Note.findOne({ noteId });
        if (existingNote) {
            return res.status(400).json({ error: `Note with ID ${noteId} already exists.` });
        }
        const newNote = new Note({
            noteId,
            content,
            userId,
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/notes/user/:userId', async (req, res) => {
        try {
            const notes = await Note.find(
                {userId: req.params.userId}
            );
            res.json(notes);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }
);

module.exports = router;