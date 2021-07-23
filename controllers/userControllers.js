const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('../controllers/factoryHandler')

// Find how users can choose avatars from already uploaded files (pictures)

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

const getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

const getAllUsers = factory.getAllDocs(User)

const getUser = factory.getDoc(User)

const updateMe = catchAsync(async (req, res, next) => {
    if (req.password || req.passwordConfirm) {
        return next(new AppError('This route is not for password update, please use /updatePassword', 404))
    }

    const filteredBody = filterObj(req.body, 'name', 'username', 'email', 'shippingAddress', 'postalCode')

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        data: { user: updatedUser }
    })
})

const updateUser = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Only Users can update their password', 401))
    }

    if (!req.body.rank) next(new AppError(`You can only update User's rank`), 401)
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body.rank, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "successfully updated User's rank",
        data: { user: updatedUser }
    })
})

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: "success",
        data: null
    })
})

const deleteUser = factory.deleteDoc(User)


module.exports = { getMe, getAllUsers, getUser, updateMe, updateUser, deleteMe, deleteUser }