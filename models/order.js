const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  stock: {
    type: mongoose.Schema.ObjectId,
    ref: 'stock',
    required: [true, 'order must contain an item']
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'order must be made by a user']
  },

  paid: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

const Order = mongoose.model('order', orderSchema)
module.exports = Order