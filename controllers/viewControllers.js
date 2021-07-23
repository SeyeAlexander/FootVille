const getHome = (req, res) => {
  res.status(200).render('home')
}

const getLogin = (req, res) => {
  res.status(200).render('login')
}

const getSignup = (req, res) => {
  res.status(200).render('signup')
}

const getShop = (req, res) => {
  res.status(200).render('shop')
}

const getWomen = (req, res) => {
  res.status(200).render('women')
}

const getProduct = (req, res) => {
  res.status(200).render('product')
}

module.exports = { getHome, getLogin, getSignup, getShop, getWomen, getProduct }
