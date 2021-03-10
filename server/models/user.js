const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    avatar: {
        type: Buffer
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    }
});

userSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 12);
        return next();
    } catch(err) {
        return next(err);
    }
}); 

userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch(err) {
        return next(err);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;