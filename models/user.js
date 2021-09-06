const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please type in your name']
    },

    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please enter a valid email']
    },

    shippingAddress: {
        type: String,
        required: [true, 'Please provide us your shipping address']
    },

    postalCode: {
        type: Number,
        required: [true, 'Please provide us your postal code']
    },

    // For avatar, set default, check on how to set different options as avatars also
    // avatar: {
    //     type: String,
    // },

    // rank: {
    //     type: String,
    //     enum: ['Beginner', 'Executive']
    //     default: 'Beginner'   
    // },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please set your password'],
        minlegth: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: true,
        select: false
    }
}) 

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function(next){
    if (!this.isModified('password') || this.isNew) return next()
    
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.pre(/^find/, function(next){
    this.find({ active: { $ne: false }})
    next()
})

userSchema.methods.comparePassword = async function(password, dbPassword) {
    return await bcrypt.compare(password, dbPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        return JWTTimestamp < changedTimeStamp
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    
    return resetToken
}

const User = mongoose.model('user', userSchema)
module.exports = User
