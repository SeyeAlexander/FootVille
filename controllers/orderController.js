const Order = require('../models/order')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const factory = require('./factory')

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {}
//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el]
//   })
//   return newObj
// }

// upon stripe completion, update order model with present payment status
const getCheckoutSession = catchAsync(async (req, res, next) => {

})

const createUserOrder = catchAsync(async (req, res, next) => {

})

// test controller, to use createUserOrder instead,
// -need to figure out how to get the fields required to create the order model
// -from executing the payment using stripe
const createOrder = factory.createDoc(Order)

const getAllOrders = factory.getAllDocs(Order)

const getOrder = factory.getDoc(Order, '', {
  path: 'cart',
  select: '-user -__v',
  populate: {
    path: 'cartItems.item',
    select: 'name discount maker sizes photo'
  }
})

const treatOrder = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'paymentStatus', 'orderStatus')
  const userOrder = await Order.findByIdAndUpdate(req.params.orderId, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: { userOrder }
  })
})

const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate({
    path: 'cart',
    select: '-user -__v',
    populate: {
      path: 'cartItems.item',
      select: 'name discount maker sizes photo'
    }
  })

  if (orders.length == 0) return next(new AppError('oops, you have not made any orders yet', 404))

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders }
  })
})

const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (order.orderStatus.status !== 'delivered') {
    return next(new AppError('order yet to be completed, delivery not confirmed yet', 404))
  }
  await Order.findByIdAndDelete(order.id)

  res.status(204).json({
    status: 'success',
    data: null
  })
})

module.exports = {
  createOrder, getCheckoutSession, createUserOrder, 
  getAllOrders, getOrder, treatOrder, getMyOrders, deleteOrder
}