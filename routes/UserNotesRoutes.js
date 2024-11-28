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
    console.log("Received request body:", req.body); // Debugging request payload

    const { noteId, content } = req.body;

    if (!noteId || !content) {
        console.error("Invalid request: Missing noteId or content");
        return res.status(400).json({ error: "Missing required fields: noteId and content." });
    }

    try {
        const userExists = await User.findOne({ userId: req.params.userId });
        if (!userExists) {
            return res.status(404).json({ error: `User with ID ${req.params.userId} not found.` });
        }

        const newNote = new Note({
            noteId,
            content,
            userId: req.params.userId,
        });

        const savedNote = await newNote.save();
        console.log("Note saved successfully:", savedNote);

        return res.status(201).json(savedNote); // Return saved note
    } catch (err) {
        console.error("Error saving note:", err.message);
        return res.status(500).json({ error: 'Server error, please try again later.' });
    }
});

router.get('/notes/user/:userId', async (req, res) => {
    const rawUserId = req.params.userId.trim(); // Sanitize userId
    console.log("Fetching notes for userId:", rawUserId);

    try {
        const notes = await Note.find({ userId: rawUserId });
        console.log("Notes retrieved:", notes); // Log the retrieved notes
        res.json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;