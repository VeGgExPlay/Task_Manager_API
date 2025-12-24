const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
    title: {type: String, default: "New Note"},
    description: {type: String, default: "Description"},
    completed: {type: Boolean, default: false},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null}
}, {timestamps: true})

module.exports = mongoose.model("Task", TaskSchema)