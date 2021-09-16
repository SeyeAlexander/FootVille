const Cart = require('../models/cart')
const Stock = require('../models/stock')
const factory = require('./factory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const addToCart = catchAsync(async (req, res, next) => {
  const stock = await Stock.findById(req.params.stockId)
  if (!stock) return next(new AppError('Item not found or not more in store', 404))

  const qty = req.body.cartItems[0].qty
  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    const cartData = {
      cartItems: [{ item: req.params.stockId, qty: qty }],
      priceTotal: stock.discount * qty,
      user: req.user.id
    }

    const newCart = new Cart(cartData)
    const myCart = await newCart.save()

    res.status(201).json({
      status: 'Cart successfully created',
      data: { myCart }
    })
  }

  if (cart) {
    const indexInCart = await cart.indexInCart(Stock, req.params.stockId)

    if (indexInCart >= 0) {
      cart.cartItems[indexInCart].qty += qty
    } else {
      cart.cartItems.push({ item: req.params.stockId, qty: qty })
    }

    if (!cart.pricetotal) cart.pricetotal = 0
    cart.priceTotal += stock.discount * qty

    const myCart = await cart.save()

    res.status(201).json({
      status: 'item successfully added to cart',
      data: { myCart }
    })
  }
})

const removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })

  const exists = await cart.inCart(Stock, req.params.stockId)
  if (!exists) return next()

  // get a way to reflect price change
  const indexInCart = await cart.indexInCart(Stock, req.params.stockId)
  cart.cartItems.splice(indexInCart, 1)

  const myCart = await cart.save()

  res.status(200).json({
    status: 'product successfully removed from cart',
    data: { myCart }
  })
})

const getMyCart = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'cartItems.item',
    select: 'name price discount maker photo'
  })

  if (!myCart) return next(new AppError(
    `You haven't added any product to your cart yet, find out kicks you like and start shopping 😁`, 404
  ))

  res.status(201).json({
    status: 'success',
    data: { myCart }
  })
})

const getAllCarts = factory.getAllDocs(Cart)

module.exports = { addToCart, removeFromCart, getMyCart, getAllCarts }