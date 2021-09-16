const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { addToCart, removeFromCart, getMyCart, getAllCarts } = require('../controllers/cartController')

const router = Router()

router.post('/myCart/:stockId/add-item', requireAuth, restrictTo('user'), addToCart)

router.get('/myCart/:stockId/remove-item', requireAuth, restrictTo('user'), removeFromCart)

router.get('/myCart', requireAuth, restrictTo('user'), getMyCart)

router.get('/', requireAuth, restrictTo('admin'), getAllCarts)

module.exports = router