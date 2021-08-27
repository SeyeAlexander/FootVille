const Stock = require('../models/stock')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

const getHome = (req, res) => {
  res.status(200).render('home', { title: 'Home' })
}

const getLogin = (req, res) => {
  res.status(200).render('login', { title: 'Login' })
}

const getSignup = (req, res) => {
  res.status(200).render('signup', { title: 'Signup' })
}

const deleteData = catchAsync(async (req, res) => {
  await Stock.deleteMany()
  await User.deleteMany()

  res.status(200).json({
    status: 'Dev-data removed..'
  })
})

module.exports = { getHome, getLogin, getSignup, deleteData }
