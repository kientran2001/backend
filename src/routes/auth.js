const express = require('express')
const router = express.Router()
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const authController = require('../app/controllers/AuthController')


router.post('/register', verifyToken, authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/logout', authController.logOut)

module.exports = router
