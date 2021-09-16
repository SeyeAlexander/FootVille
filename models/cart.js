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


cartSchema.methods.indexInCart = async function(Stock, id) {
  const stock = await Stock.findById(id)
  const index = this.cartItems.findIndex(
    itemsInCart => new String(itemsInCart.item).trim() === new String(stock.id).trim()
  )
  return index
}

const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart