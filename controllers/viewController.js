const getHome = (req, res) => {
  res.status(200).render('home', { title: 'Home' })
}

const getLogin = (req, res) => {
  res.status(200).render('login', { title: 'Login' })
}

const getSignup = (req, res) => {
  res.status(200).render('signup', { title: 'Signup' })
}

module.exports = { getHome, getLogin, getSignup }