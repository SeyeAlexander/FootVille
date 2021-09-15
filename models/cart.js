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
})

cartSchema.methods.inCart = async function(Stock, id) {
  const stock = await Stock.findById(id)

  const exists = this.cartItems.findIndex(itemsInCart => itemsInCart.item === stock.id )
  if (exists >= 0) return exists
}




const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart