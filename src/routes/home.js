const express = require('express')
const router = express.Router()
const homeController = require('../app/controllers/HomeController')
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')

router.get('/', verifyToken, verifyToken, homeController.showAll)
// router.get('/:id', verifyToken, homeController.show)
router.get('/home-details/:id', verifyToken, homeController.homeDetails)

router.get('/add', verifyToken, homeController.add)
router.post('/create', verifyToken, homeController.create)

router.get('/:id/edit', verifyToken, homeController.edit)
router.put('/:id/update', verifyToken, homeController.update)

router.delete('/:id', verifyToken, homeController.delete)

router.delete('/:homeId/deletePhone', verifyToken, homeController.deletePhoneNumber)
router.post('/:homeId/phone/:newPhoneNumber', verifyToken, homeController.addPhoneNumber)

// Các api chưa dùng đến
// router.get('/user-of-home/:id', verifyToken, homeController.userOfHome)
// router.get('/waterMeter-of-home/:id', verifyToken, homeController.waterMeterOfHome)

module.exports = router
