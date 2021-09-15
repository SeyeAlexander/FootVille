const Cart = require('../models/cart')
const factory = require('./factory')

const setIds = (req, res, next) => {
  if (!req.body.cartItems) req.body.cartItems = req.params.stockId
  if (!req.body.user) req.body.user = req.user.id
  next()
}



module.exports = { setProductIds }
