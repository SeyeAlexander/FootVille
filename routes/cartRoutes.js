const express = require('express')
const router = express.Router({ mergeParams: true })

const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { setIds, addcartItem, getcartItems, getcartItem, deletecartItem } = require('../controllers/cartItemControllers')

router.post('/', requireAuth, restrictTo('user'), setIds, addcartItem)

router.get('/', requireAuth, getcartItems)

router.get('/:id', requireAuth, getcartItem)

router.delete('/:id', requireAuth, deletecartItem)

module.exports = router
