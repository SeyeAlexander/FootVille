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

const userRouter = require('./routes/userRoutes')
const stockRouter = require('./routes/stockRoutes')
const cartRouter = require('./routes/cartRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')

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

app.use('/', viewRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/stocks', stockRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/reviews', reviewRouter)

app.use((req, res, next) => {
    next(new AppError(`cannot find ${ req.originalUrl } on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
