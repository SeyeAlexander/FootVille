const { promisify } = require('util')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config  = require('config')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const requireAuth = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        next(new AppError('You are not logged in, please log in to get access', 401))
    }

    const decoded = await promisify(jwt.verify)(token, config.get('JWTSecret')) 

    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        next(new AppError('User with this token no longer exists', 401))
    }

    if(currentUser.changedPasswordAfter(decoded.iat)) {
        next(new AppError('User recently changed password, please login again', 401))
    }

    req.user = currentUser
    res.locals.user = currentUser
    next()
})

const checkUser = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, config.get('JWTSecret')) 

            const currentUser = await User.findById(decoded.id)

            if (!currentUser) {
                return next()
            }

            if(currentUser.changedPasswordAfter(decoded.iat)) {
                return next()
            }

            res.locals.user = currentUser
            return next()
        }
        catch(err) {
            return next()
        }
    }
    next()
}

const restrictTo = (...roles) => {
    return (req, res, next) =>{
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Sorry, you do not have permission for this action', 403))
        }
        next()
    } 
}

module.exports = { requireAuth, checkUser, restrictTo }
