const express = require('express')
const app = express()
const AppError = require('../utils/appError')

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message, 404)
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}, please use another value!` 
    return new AppError(message, 404)
}

const handleValidationErrorDB = (err) => {
    const value = Object.values(err.errors).map( el => el.message)

    const message = `Invalid input data: ${value.join('. ')}`
    return new AppError(message, 404)
}

const handleJWTError = () => new AppError('Invalid token! please log in again', 401)

const handleJWTExpiredError = () => new AppError('Token has expired! please log in again', 401)

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            // error: err,
            // stack: err.stack
        })
    }

    return res.status(err.statusCode).render('error', { title: 'Error', msg: err.message })
}

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }             
        // console.log('Error 💥', err)
        return res.status(500).json({
            status: 'error',
            message: 'something went wrong!'
        })  
    }

    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Error', msg: err.message
        })
    }

    return res.status(err.statusCode).render('error', {
        title: 'Error', msg: 'something went wrong'
    })  
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (app.get('env') === 'development') {
        sendErrorDev(err, req, res)
    } 
    else if (app.get('env') === 'production') {
        if (err.name === 'CastError') err = handleCastErrorDB(err)
        if (err.code === 11000) err = handleDuplicateFieldsDB(err)
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err)
        if (err.name === 'JsonWebTokenError') err = handleJWTError()
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()

        sendErrorProd(err, req, res)
    }
}

