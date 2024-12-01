const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const NoteSchema = new mongoose.Schema({
    noteId: { type: Number },
    content: { type: String, required: true },
    time: { type: String },
    isInTrash: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    fontColor: { type: Int32, default: -16777216 },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: Number, default: 400 },
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Note', NoteSchema);