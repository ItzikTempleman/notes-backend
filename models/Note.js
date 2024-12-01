const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const NoteSchema = new mongoose.Schema({
    noteId: { type: Number, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: String, default: () => new Date().toISOString() },
    isInTrash: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    fontColor: { type: Int32, default: -16777216 },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: Number, default: 400 },
});

module.exports = mongoose.model('Note', NoteSchema);