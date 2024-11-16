const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path matches your project

// POST: Create a new user
router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET: Retrieve all users
router.get('/users', async (req, res) => {  // Notice the '/'
    try {
        const users = await User.find();  // Correct: No extra args
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Retrieve user by ID
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId }); // Correct query
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;  // Properly export the router