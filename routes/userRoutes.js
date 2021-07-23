const express = require('express')
const { requireAuth, restrictTo } = require('../middleware/authMiddleware')
const { signup, login, logout, changePassword, forgotPassword, resetPassword } = require('../controllers/authController')
const { getMe, getAllUsers, getUser, updateMe, updateUser, deleteMe, deleteUser } = require('../controllers/userControllers')

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

router.get('/logout', logout)

router.post('/forgotPassword', forgotPassword)

router.patch('/resetPassword/:token', resetPassword)

router.patch('/changePassword', requireAuth, changePassword)

router.get('/getAllUsers', requireAuth, restrictTo('admin'), getAllUsers)

router.get('/me', requireAuth, getMe, getUser)

router.get('/:id', requireAuth, restrictTo('admin'), getUser)

router.patch('/updateMe', requireAuth, updateMe)

router.delete('/deleteMe', requireAuth, deleteMe)

router.patch('/:id', requireAuth, restrictTo('admin'), updateUser)

router.delete('/:id', requireAuth, restrictTo('admin'), deleteUser)

module.exports = router
