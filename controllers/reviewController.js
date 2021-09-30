const Review = require('../models/review')
const factory = require('./factory')

const setIds = async (req, res, next) => {
  if (!req.body.stock) req.body.stock = req.params.stockId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

const addReview = factory.createDoc(Review)

const getReviews = factory.getAllDocs(Review)

const updateReview = factory.updateDoc(Review)

const deleteReview = factory.deleteDoc(Review)

module.exports = { setIds, addReview, getReviews, updateReview, deleteReview }