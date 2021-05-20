const express = require('express')
const cartRoutes = require('./cartRoutes')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const stockController = require('../controllers/stockControllers')

const router = express.Router()

router.use('/:stockId/cart', cartRoutes)

router.get('/', stockController.getAllStocks)

router.get('/:id', stockController.getStock)

router.post('/', requireAuth, restrictTo('admin'), stockController.createStock)

router.patch('/:id', requireAuth, restrictTo('admin'), stockController.uploadStockImage, stockController.updateStock)

router.delete('/:id', requireAuth, restrictTo('admin'), stockController.deleteStock)

module.exports = router
