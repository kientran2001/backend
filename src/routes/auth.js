const express = require('express')
const router = express.Router()
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const authController = require('../app/controllers/AuthController')


router.get('/login', authController.login)
router.post('/login', authController.loginUser)

router.post('/register', verifyToken, authController.registerUser)

router.get('/logout', authController.logOut)

module.exports = router
