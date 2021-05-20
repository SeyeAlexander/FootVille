const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  stock: {
    type: Schema.ObjectId,
    ref: 'stock',
    required: [true, 'cart item must contain a Tour']
  },

  user: {
    type: Schema.ObjectId,
    ref: 'user',
    required: [true, 'cart item must contain a User']
  },

  paid: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
})

cartSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'stock',
    select: 'name standardPrice photo'
  })
  next()
})

const Cart = mongoose.model('cartItem', cartSchema)
module.exports = Cart
