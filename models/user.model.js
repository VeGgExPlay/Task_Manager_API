const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    refreshTokens: [{token: {type: String, required: true}, createdAt: {type: Date, default: Date.now}}],
    role: {type: String, enum: ["user", "admin"], required: true, default: "user"}
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)