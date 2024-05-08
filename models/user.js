const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        requied: true
    },
    password: {
        type: String,
        requied: true
    },
    name: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        default: "I am new User"
    },
    role: {
        type: String,
        default: 'client'
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);