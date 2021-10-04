const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { createOrder, getCheckoutSession, getAllOrders, 
  getOrder, treatOrder, getMyOrders, deleteOrder } = require('../controllers/orderController')

const router = Router()

router.post('/', createOrder)

router.get('/checkout-session', requireAuth, getCheckoutSession)

router.get('/', requireAuth, restrictTo('admin'), getAllOrders)

router.get('/:id', requireAuth, restrictTo('admin'), getOrder)

router.patch('/:orderId', requireAuth, restrictTo('admin'), treatOrder)

router.get('/me/my-orders', requireAuth, restrictTo('user'), getMyOrders)

router.delete('/:id', requireAuth, restrictTo('admin'), deleteOrder )

module.exports = router