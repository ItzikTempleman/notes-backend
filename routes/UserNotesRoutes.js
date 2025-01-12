const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const {v4: uuidv4} = require('uuid');

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
            const user = await User.findOne({userId: req.params.userId});
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

router.delete('/users/email/:email', async (req, res) => {
    try {

        const email = req.params.email;
        const deletedUser = await User.findOneAndDelete({email});

        if (!deletedUser) {
            return res.status(404).json({error: 'User not found'});
        }
        await Note.deleteMany({userId: deletedUser.userId});
        res.json({message: 'User and associated notes deleted successfully', user: deletedUser});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});



router.put('/users/:usersId', async (req, res) => {
    try {
        const {userId} = req.params
        const {email, password, phoneNumber, profileImage,selectedWallpaper} = req.body

        const fieldsToUpdate = {}
        if (email !== undefined) fieldsToUpdate.email = email
        if (password !== undefined) fieldsToUpdate.password = password
        if (phoneNumber !== undefined) fieldsToUpdate.phoneNumber = phoneNumber
        if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage
        if (selectedWallpaper !== undefined) fieldsToUpdate.selectedWallpaper = selectedWallpaper

        if (Object.keys(fieldsToUpdate).length === 0) {return res.status(400).json({error: "No valid fields provided to update"})}

        const updatedUser = await Note.findOneAndUpdate({userId}, {$set: fieldsToUpdate}, {new: true})
        if (!updatedUser) {return res.status(404).json({error: 'User not found'})}

        return res.status(200).json({message: 'User updated successfully', note: updatedUser})
    }
    catch (err) {
        console.error('Error updating user:', err)
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})



//Notes
router.post('/notes/user/:userId', async (req, res) => {
    const {
        noteId,
        userId,
        content,
        time,
        title,
        isInTrash,
        isStarred,
        isPinned,
        fontColor,
        noteImage,
        fontSize,
        fontWeight
    } = req.body;
    const newNote = new Note({
        title,
        noteId,
        userId,
        content,
        time,
        isInTrash,
        isStarred,
        isPinned,
        fontColor,
        noteImage,
        fontSize,
        fontWeight
    });
    try {
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({error: "Duplicate noteId error. This noteId already exists for this user."});
        } else {
            console.error('Failed to save the note:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
});


router.get('/notes/user/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    console.log("Fetching notes for userId:", userId);
    try {
        const notes = await Note.find({userId});
        if (notes.length === 0) {
            console.warn("No notes found for userId:", userId);
        } else {
            console.log("Notes retrieved:", notes);
        }
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes for userId:", userId, err.message);
        res.status(500).json({error: err.message});
    }
});


router.put('/notes/:noteId', async (req, res) => {
    try {
        const {noteId} = req.params
        const {title, content, time, isInTrash, isStarred, isPinned, fontColor, noteImage, fontSize, fontWeight} = req.body
        const fieldsToUpdate = {}
        if (title !== undefined) fieldsToUpdate.title = title
        if (content !== undefined) fieldsToUpdate.content = content
        if (time !== undefined) fieldsToUpdate.time = time
        if (isInTrash !== undefined) fieldsToUpdate.isInTrash = isInTrash
        if (isStarred !== undefined) fieldsToUpdate.isStarred = isStarred
        if (isPinned !== undefined) fieldsToUpdate.isPinned = isPinned
        if (fontColor !== undefined) fieldsToUpdate.fontColor = fontColor
        if (noteImage !== undefined) fieldsToUpdate.noteImage = noteImage
        if (fontSize !== undefined) fieldsToUpdate.fontSize = fontSize
        if (fontWeight !== undefined) fieldsToUpdate.fontWeight = fontWeight
        if (Object.keys(fieldsToUpdate).length === 0) {return res.status(400).json({error: "No valid fields provided to update"})}
        const updatedNote = await Note.findOneAndUpdate({noteId}, {$set: fieldsToUpdate}, {new: true})
        if (!updatedNote) {return res.status(404).json({error: 'Note not found'})}
        return res.status(200).json({message: 'Note updated successfully', note: updatedNote})
    }
    catch (err) {
        console.error('Error updating note:', err)
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})


router.delete('/notes/:noteId', async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const deletedNote = await Note.findOneAndDelete({noteId});
        if(isNaN(noteId)){
            return res.status(400).json({error: `noteId: '${noteId}' is not valid`})
        }
        if (!deletedNote) {
            return res.status(404).json({error: `Note ${noteId} not found`});
        }
        return res.status(200).json({
            message: 'Note deleted successfully',
            note: deletedNote,
        });
    } catch (err) {
        console.error('Error deleting note:', err);
        return res.status(500).json({error: 'Internal server error'});
    }
});


router.delete('/delete-all-notes', async (req, res) => {
    try {
        const result = await Note.deleteMany({});
        res.status(200).json({
            message: "All notes have been deleted successfully",
            deletedCount: result.deletedCount,

        });
    } catch (error) {
        console.error('Detailed Error: ', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;