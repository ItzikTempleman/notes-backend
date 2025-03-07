const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const Task = require('../models/Task');
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

router.put('/user/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const {email, password, phoneNumber, profileImage, selectedWallpaper, isViewGrid} = req.body;

        const fieldsToUpdate = {};
        if (email !== undefined) fieldsToUpdate.email = email;
        if (password !== undefined) fieldsToUpdate.password = password;
        if (phoneNumber !== undefined) fieldsToUpdate.phoneNumber = phoneNumber;
        if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;
        if (selectedWallpaper !== undefined) fieldsToUpdate.selectedWallpaper = selectedWallpaper;
        if (isViewGrid !== undefined) fieldsToUpdate.isViewGrid = isViewGrid;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({error: "No valid fields provided to update"});
        }

        const updatedUser = await User.findOneAndUpdate(
            {userId},
            {$set: fieldsToUpdate},
            {new: true}
        );

        if (!updatedUser) {
            return res.status(404).json({error: 'User not found'});
        }

        return res.status(200).json({message: 'User updated successfully', user: updatedUser});
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({
            error: 'Internal server error',
            details: err.message // Include error details
        });
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
        const noteId = req.params.noteId;
        const {
            userId, title, content, time, isInTrash, isStarred, isPinned,
            fontColor, noteImage, fontSize, fontWeight
        } = req.body;

        if (!userId) {
            return res.status(400).json({error: 'userId is required in the request body'});
        }

        const fieldsToUpdate = {};
        if (title !== undefined) fieldsToUpdate.title = title;
        if (content !== undefined) fieldsToUpdate.content = content;
        if (time !== undefined) fieldsToUpdate.time = time;
        if (isInTrash !== undefined) fieldsToUpdate.isInTrash = isInTrash;
        if (isStarred !== undefined) fieldsToUpdate.isStarred = isStarred;
        if (isPinned !== undefined) fieldsToUpdate.isPinned = isPinned;
        if (fontColor !== undefined) fieldsToUpdate.fontColor = fontColor;
        if (noteImage !== undefined) fieldsToUpdate.noteImage = noteImage;
        if (fontSize !== undefined) fieldsToUpdate.fontSize = fontSize;
        if (fontWeight !== undefined) fieldsToUpdate.fontWeight = fontWeight;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({error: "No valid fields provided to update"});
        }

        // Use both noteId and userId in the query.
        const updatedNote = await Note.findOneAndUpdate(
            {noteId, userId},
            {$set: fieldsToUpdate},
            {new: true}
        );

        if (!updatedNote) {
            return res.status(404).json({error: 'Note not found'});
        }

        return res.status(200).json({message: 'Note updated successfully', note: updatedNote});
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({error: 'Internal server error', details: err.message});
    }
});

router.delete('/notes/:noteId', async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const deletedNote = await Note.findOneAndDelete({noteId});
        if (isNaN(noteId)) {
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

router.delete('/notes/trash/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const result = await Note.deleteMany({userId, isInTrash: true});
        res.status(200).json({
            message: "All trashed notes for this user have been deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting trashed notes:', error);
        res.status(500).json({
            error: 'Internal server error', details: error.message, stack: error.stack
        });
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

//Tasks
router.post('/tasks/user/:userId', async (req, res) => {
    const {
        taskId,
        isDone,
        taskTitle,
        taskContent,
        userId
    } = req.body;
    const newTask = new Task({
        taskId,
        isDone,
        taskTitle,
        taskContent,
        userId
    });
    try {
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({error: "Duplicate taskId error. This taskId already exists for this user."});
        } else {
            console.error('Failed to save the task:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
});


router.get('/tasks/user/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    console.log("Fetching tasks for userId:", userId);
    try {
        const tasks = await Task.find({userId});
        if (tasks.length === 0) {
            console.warn("No tasks found for userId:", userId);
        } else {
            console.log("Tasks retrieved:", tasks);
        }
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching tasks for userId:", userId, err.message);
        res.status(500).json({error: err.message});
    }
});


router.put('/tasks/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const {
            userId, taskTitle, taskContent, isDone
        } = req.body;

        if (!userId) {
            return res.status(400).json({error: 'userId is required in the request body'});
        }

        const fieldsToUpdate = {};
        if (taskTitle !== undefined) fieldsToUpdate.taskTitle = taskTitle;
        if (taskContent !== undefined) fieldsToUpdate.taskContent = taskContent;
        if (isDone !== undefined) fieldsToUpdate.isDone = isDone;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({error: "No valid fields provided to update"});
        }

        const updatedTask = await Task.findOneAndUpdate(
            {taskId, userId},
            {$set: fieldsToUpdate},
            {new: true}
        );

        if (!updatedTask) {
            return res.status(404).json({error: 'Task not found'});
        }

        return res.status(200).json({message: 'Task updated successfully', task: updatedTask});
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({error: 'Internal server error', details: err.message});
    }
});


router.delete('/tasks/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const deletedTask = await Task.findOneAndDelete({taskId});
        if (isNaN(taskId)) {
            return res.status(400).json({error: `taskId: '${taskId}' is not valid`})
        }
        if (!deletedTask) {
            return res.status(404).json({error: `Task ${taskId} not found`});
        }
        return res.status(200).json({
            message: 'Task deleted successfully',
            note: deletedTask,
        });
    } catch (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({error: 'Internal server error'});
    }
});

router.delete('/delete-all-tasks', async (req, res) => {
    try {
        const result = await Task.deleteMany({});
        res.status(200).json({
            message: "All tasks have been deleted successfully",
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