const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { setProductIds } = require('../controllers/cartController')

const router = Router()

module.exports = router