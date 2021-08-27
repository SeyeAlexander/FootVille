const express = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { getHome, getLogin, getSignup, deleteData } = require('../controllers/viewController')
const { getAllStock, getAllStocksWomen, getStock } = require('../controllers/stockController')

const router = express.Router()

router.get('/', getHome)

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.get('/shop', getAllStock)

router.get('/women', getAllStocksWomen)

router.get('/shoes/:slug', getStock)

router.delete('/api/v1/deleteDevData', requireAuth, restrictTo('admin'), deleteData)

module.exports = router