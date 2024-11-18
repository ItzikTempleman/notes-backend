const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
    noteId: { type: Number, unique: true, default: () => Math.floor(Math.random() * 1000000) },
    content: { type: String, required: true },
    time: { type: String, default: () => new Date().toLocaleTimeString() },
    isInTrash: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    fontColor: { type: Number, default: 0 },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: Number, default: 400 },

    userId: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: true
    }
});



module.exports = mongoose.model('Note', NoteSchema);