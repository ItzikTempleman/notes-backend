const mongoose = require('mongoose');

function getCurrentTime() {
    const date = new Date();
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

const NoteSchema = new mongoose.Schema({
    noteId: { type: Number, required: true },
    content: { type: String, required: true },
    time: {
        type: String,
        default: getCurrentTime,
    },
    isInTrash: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    fontColor: { type: Number, default: -16777216 },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: Number, default: 400 },
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Note', NoteSchema);