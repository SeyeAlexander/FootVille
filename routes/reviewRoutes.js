const { Router } = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const {
  setIds, addReview, getReview, getReviews, updateReview, deleteReview 
} = require('../controllers/reviewController')

const router = Router({ mergeParams: true })

router.post('/', requireAuth, restrictTo('user'), setIds, addReview)

router.get('/', requireAuth, getReviews)

router.patch('/:id', requireAuth, restrictTo('user'), updateReview)

router.delete('/:id', requireAuth, restrictTo('admin'), deleteReview)

module.exports = router