import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },

    userName: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },

    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
        require: true
    },

    password: {
        type: String,
        minlength: [6, 'In password must 6 character required'],
        require: true
    },

    profilePicture: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
    },

    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },

    isVerified:{
        type: Boolean,
        default: false
    },

    mobileNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },


    displayName: {
        type: String,
        default: function () {
            return `${this.fullName} (@${this.userName})`
        }
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    try {
        const handlePassword = await bcrypt.hash(this.password, 10);
        this.password = handlePassword;
        next()
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model("User", userSchema);

export default User;