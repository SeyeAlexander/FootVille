const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { getHome, getLogin, getSignup } = require('../controllers/viewController')
const { getAllStock, getAllStocksWomen, getStock } = require('../controllers/stockController')

const router = Router()

router.get('/', getHome)

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.get('/shop', getAllStock)

router.get('/women', getAllStocksWomen)

router.get('/shoes/:slug', getStock)

module.exports = router
