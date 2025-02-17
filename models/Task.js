const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskId: {type: Number, required: true},
    isDone: {type: Boolean, default: false},
    taskTitle: {type: String, required: true},
    taskContent: {type: String},
    userId: {type: String, required: true}
});

TaskSchema.index({userId: 1, taskId: 1}, {unique: true});

module.exports = mongoose.model('Task', TaskSchema);