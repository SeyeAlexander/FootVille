const express = require('express')
const { getHome, getLogin, getSignup, getShop, getWomen, getProduct } = require('../controllers/viewControllers')

const router = express.Router()

router.get('/', getHome)

router.get('/women', getWomen)

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.get('/shop', getShop)

router.get('/product', getProduct)

module.exports = router
