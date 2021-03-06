const Cart = require('../models/cart')
const Stock = require('../models/stock')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./factory')

const setQty = async(req, res, next) => {
  if (!req.body.cartItems[0].qty) req.body.cartItems[0].qty = 1
  next()
}

const addToCart = catchAsync(async (req, res, next) => {
  const stock = await Stock.findById(req.params.stockId)
  if (!stock) return next(new AppError('Item not found or not more in store', 404))

  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    const cartData = {
      cartItems: [{ item: req.params.stockId, sizePick: req.body.cartItems[0].sizePick, qty: req.body.cartItems[0].qty }],
      priceTotal: stock.discount * req.body.cartItems[0].qty,
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
    const indexInCart = await cart.indexInCart(Stock, req.params.stockId, req.body.cartItems[0].sizePick)

    if (indexInCart >= 0) {
      cart.cartItems[indexInCart].qty += req.body.cartItems[0].qty
    } else {
      cart.cartItems.push({ item: req.params.stockId, sizePick: req.body.cartItems[0].sizePick, qty: req.body.cartItems[0].qty })
    }

    if (!cart.pricetotal) cart.pricetotal = 0
    cart.priceTotal += stock.discount * req.body.cartItems[0].qty

    const myCart = await cart.save()

    res.status(201).json({
      status: 'item successfully added to cart',
      data: { myCart }
    })
  }
})

const getMyCart = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'cartItems.item',
    select: 'name discount maker sizes photo'
  })

  if (!myCart) return next(new AppError(
    `You haven't added any product to your cart yet, find out kicks you like and start shopping 😁`, 404
  ))

  res.status(201).json({
    status: 'success',
    results: myCart.cartItems.length,
    data: { myCart }
  })
})

const getAllCarts = factory.getAllDocs(Cart)

const removeInCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })
  if (!cart) return next(new AppError(
    `You haven't added any product to your cart yet, find out kicks you like and start shopping 😁`, 404
  ))

  const indexInCart = await cart.indexInCart(Stock, req.params.stockId, req.params.sizePick)

  if (indexInCart >= 0) {
    cart.cartItems[indexInCart].qty -= 1

    const stock = await Stock.findById(req.params.stockId)
    const removedTotal = stock.discount * 1

    cart.priceTotal -= removedTotal
    const cartState = await cart.save()

    const indexNow = await cart.indexInCart(Stock, req.params.stockId, req.params.sizePick)
    const quantity = cartState.cartItems[indexNow].qty

    if (quantity <= 0) {
      cartState.cartItems.splice(indexNow, 1)
      const myCart = await cartState.save()
  
      res.status(200).json({
        status: 'item in cart successfully removed',
        data: { myCart }
      })
    } 
    else {
      res.status(200).json({
        status: 'item quantity in cart successfully reduced',
        data: { cartState }
      })
    }
  } 
  else {
    return next(new AppError(
      `You dont have this in your cart, add this too😁`, 404
    ))
  }
})

const removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })
  const indexInCart = await cart.indexInCart(Stock, req.params.stockId, req.params.sizePick)

  // get a way to reflect price change
  const stock = await Stock.findById(req.params.stockId)
  const removedTotal = stock.discount * cart.cartItems[indexInCart].qty
  cart.priceTotal -= removedTotal

  if (cart.priceTotal) cart.cartItems.splice(indexInCart, 1)
  const myCart = await cart.save()

  res.status(200).json({
    status: 'item successfully removed from cart',
    data: { myCart }
  })
})

const emptyMyCart = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findOne({ user: req.user.id })
  await Cart.findByIdAndDelete(myCart.id)

  res.status(204).json({
    status: 'your cart is cleared',
    data: null
  })
})

module.exports = { setQty, addToCart, getMyCart, getAllCarts, removeInCart, removeFromCart, emptyMyCart }