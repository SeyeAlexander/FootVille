const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { setQty, addToCart, getMyCart, getAllCarts, removeInCart, removeFromCart, emptyMyCart } = require('../controllers/cartController')

const router = Router()

router.post('/myCart/:stockId/add-item', requireAuth, restrictTo('user'), setQty, addToCart)

router.get('/myCart', requireAuth, restrictTo('user'), getMyCart)

router.get('/', requireAuth, restrictTo('admin'), getAllCarts)

router.post('/myCart/:stockId/:sizePick/reduce-quantity', requireAuth, restrictTo('user'), removeInCart)

router.post('/myCart/:stockId/:sizePick/remove-item', requireAuth, restrictTo('user'), removeFromCart)

router.delete('/myCart', requireAuth, restrictTo('user'), emptyMyCart)

module.exports = router