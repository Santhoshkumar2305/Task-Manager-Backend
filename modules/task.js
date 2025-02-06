const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    due: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false }
},{timestamps: true});

module.exports = mongoose.model("task", TaskSchema);
