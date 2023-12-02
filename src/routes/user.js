const express = require('express')
const router = express.Router()
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const userController = require('../app/controllers/UserController')

router.get('/', verifyToken, userController.showAll)

router.get('/add', verifyToken, userController.add)
router.get('/:id', verifyToken, userController.show)

router.get('/:id/edit', verifyToken, userController.edit)
router.put('/:id/update', verifyToken, userController.update)

router.delete('/:id', verifyToken, userController.delete)

// Các api chưa dùng đến
// router.get('/homes-of-user/:id', verifyToken, userController.homesOfUser)

module.exports = router
