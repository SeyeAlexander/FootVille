const cartItem = require('../models/cart')
const factory = require('../controllers/factoryHandler')

const setIds = (req, res, next) => {
    if (!req.body.stock) req.body.stock = req.params.stockId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

const addcartItem = factory.createDoc(cartItem)

const getcartItems = factory.getAllDocs(cartItem)

const getcartItem = factory.getDoc(cartItem)

const deletecartItem = factory.deleteDoc(cartItem)

module.exports = { setIds, addcartItem, getcartItems, getcartItem, deletecartItem }