const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    identity: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
})

module.exports = User = mongoose.model('users', userSchema)
