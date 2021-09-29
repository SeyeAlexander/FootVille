const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { 
  uploadStockImage, createStock, getAllStock,
  getStock, updateStock, deleteStock
} = require('../controllers/stockController')

const reviewRouter = require('./reviewRoutes') 

const router = Router()

router.use('/:stockId/reviews', reviewRouter)

router.get('/', getAllStock)

router.get('/:id', getStock)

router.post('/', requireAuth, restrictTo('admin'), uploadStockImage, createStock)

router.patch('/:id', requireAuth, restrictTo('admin'), uploadStockImage, updateStock)

router.delete('/:id', requireAuth, restrictTo('admin'), deleteStock)

module.exports = router
