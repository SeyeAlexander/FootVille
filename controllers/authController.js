const express = require('express')
const app = express()
const config  = require('config')
const crypto = require('crypto')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Email = require('../utils/email')

const signToken = (id) => {
    return token = jwt.sign({ id }, config.get('JWTSecret'), { expiresIn: config.get('JWTExpires')})
}

const createToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    const cookieOptions = {
        expires: new Date(Date.now() + config.get('CookieExpires') * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (app.get('env') === 'production') cookieOptions.secure === true

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    })
}

const signup = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body)

    // const url = `${req.protocol}://${req.get('host')}/me`
    // await new Email(newUser, url).sendWelcome()

    createToken(newUser, 201, res)
})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password ) {
        return next(new AppError('Please provide email and password', 404))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !await user.comparePassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createToken(user, 201, res)
})

const logout = (req, res,) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: 'success'})
}

const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(new AppError('There is no user with this email', 404))

    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    try {
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
        await new Email(user, resetUrl).sendPasswordReset()

        res.status(200).json({
            status: "success",
            message: "Password reset token sent to email"
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending email, try again later', 500))
    }
})

const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() }})
    if (!user) return next(new AppError('Token is invalid or has expired', 404))

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    createToken(user, 201, res)
})

const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Password incorrect', 401))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    createToken(user, 200, res)
})

module.exports = { signup, login, logout, forgotPassword, resetPassword, updatePassword }
