const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  cartItems: [
    {
      item: {
        type: Schema.ObjectId,
        ref: 'stock',
        required: [true, 'cart must contain an item']
      },
      sizePick: Number,
      itemSlug: String,
      qty: Number
    }
  ],

  priceTotal: Number,

  user: {
    type: Schema.ObjectId,
    ref: 'user',
    required: [true, 'cart must opened by a user']
  }
},

{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

cartSchema.pre('save', function(next) {
  this.cartItems.forEach(itemInCart => {
    itemInCart.itemSlug = new String(itemInCart.item).trim() + new String(itemInCart.sizePick).trim()
  })
  next()
})

cartSchema.methods.indexInCart = async function(Stock, id, size) {
  const stock = await Stock.findById(id)
  const indexInCart = this.cartItems.findIndex(
    itemsInCart => itemsInCart.itemSlug === new String(stock.id).trim() + new String(size).trim()
  )
  return indexInCart
}

const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart