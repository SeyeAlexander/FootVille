const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { addToCart, removeFromCart, getMyCart, emptyMyCart, getAllCarts } = require('../controllers/cartController')

const router = Router()

router.post('/myCart/:stockId/add-item', requireAuth, restrictTo('user'), addToCart)

router.post('/myCart/:stockId/remove-item', requireAuth, restrictTo('user'), removeFromCart)

router.get('/myCart', requireAuth, restrictTo('user'), getMyCart)

router.delete('/myCart', requireAuth, restrictTo('user'), emptyMyCart)

router.get('/', requireAuth, restrictTo('admin'), getAllCarts)

module.exports = router