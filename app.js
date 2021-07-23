const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')
// const cors = require('cors')

const userRoutes = require('./routes/userRoutes')
const stockRoutes = require('./routes/stockRoutes')
const viewRoutes = require('./routes/viewRoutes')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./middleware/errorMiddleware')

const app = express()

app.use(helmet({ contentSecurityPolicy: false }));

app.set('view engine', 'pug')
app.use(express.static('public'))

// app.use(cors())
// app.options('*', cors())

if (app.get('env') === 'development') {
    app.use(morgan('dev'))
    console.log('development..')
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour"
})

app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp({
    whitelist: [
        'price',
        'discount',
        'sizes'
    ]
}))

app.use(compression())

app.use('/', viewRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/stocks', stockRoutes)

app.use((req, res, next) => {
    next(new AppError(`cannot find ${ req.originalUrl } on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
