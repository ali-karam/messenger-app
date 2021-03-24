const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate-v2');

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

userSchema.plugin(mongoosePaginate);

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

userSchema.methods.findOtherUsersByUsername = async function(queryUsername, page, limit, next) {
    try {
        const options = { page, limit, select: 'username avatar' }
        const regex = new RegExp(queryUsername, 'i');
        const query = { $and: [
            { username: { $regex: regex } },
            { _id:  { $ne: this._id } }
        ] };
        const result = await User.paginate(query, options);
        return result;
    } catch(err) {
        return next(err);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;