const multer = require('multer')
const Stock = require('../models/stock')
const AppError = require('../utils/appError')
const factory = require('./factory')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/stock/')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        const fil = file.originalname.split('.')[0]
        cb(null, `stock-${fil}-${Date.now()}.${ext}`) 
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadStockImage = upload.single('photo')

const createStock = factory.createDoc(Stock)

const getAllStock = factory.getAllDocs(Stock, 'shop')

const getAllStocksWomen = factory.getAllDocs(Stock, 'women')

const getStock = factory.getDoc(Stock, 'product')

const updateStock = factory.updateDoc(Stock)

const deleteStock = factory.deleteDoc(Stock)

module.exports = { uploadStockImage, createStock, getAllStock, getAllStocksWomen, getStock, updateStock, deleteStock }
