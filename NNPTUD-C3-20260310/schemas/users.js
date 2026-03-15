let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username không được trùng"],
        required: [true, "username không được rỗng"]
    },
    password: {
        type: String,
        required: [true, "password không được rỗng"]
    },
    email: {
        type: String,
        unique: [true, "email không được trùng"],
        required: [true, "email không được rỗng"]
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
        required: true
    },
    loginCount: {
        type: Number,
        default: 0,
        min: [0, "loginCount không được nhỏ hơn 0"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('user', userSchema)
