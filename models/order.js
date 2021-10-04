const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: 'cart',
    required: [true, 'order must be made on checking out cart']
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'order must be made by a user']
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'refund'],
    required: true
  },

  orderStatus:{
    status: {
      type: String,
      enum: ['ordered', 'shipped', 'delivered', 'cancelled'],
      default: 'ordered'
    },
    
    timeProcessed: {
      type: Date,
      default: Date.now()
    }
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

orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username email shippingAddress postalCode'
  })
  next()
})

const Order = mongoose.model('order', orderSchema)
module.exports = Order