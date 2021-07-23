const express = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const stockController = require('../controllers/stockControllers')

const router = express.Router()

router.get('/', stockController.getAllStocks)

router.get('/:id', stockController.getStock)

router.post('/', requireAuth, restrictTo('admin'), stockController.uploadStockImage, stockController.createStock)

router.patch('/:id', requireAuth, restrictTo('admin'), stockController.uploadStockImage, stockController.updateStock)

router.delete('/:id', requireAuth, restrictTo('admin'), stockController.deleteStock)

module.exports = router
