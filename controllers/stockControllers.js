const multer = require('multer')
const Stock = require('../models/stock')
const AppError = require('../utils/appError')
const factory = require('./factoryHandler')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req.file.id}-${Date.now()}-${ext}`) 
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

exports.uploadStockImage = upload.single('photo')

exports.createStock = factory.createDoc(Stock)

exports.getAllStocks = factory.getAllDocs(Stock)

exports.getStock = factory.getDoc(Stock)

exports.updateStock = factory.updateDoc(Stock)

exports.deleteStock = factory.deleteDoc(Stock)
