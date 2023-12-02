const express = require('express')
const router = express.Router()
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const waterMeterController = require('../app/controllers/WaterMeterController')

router.get('/all', verifyToken, waterMeterController.showAll)
router.get('/', verifyToken, (req, res) => { return res.send(`<h1>Chưa có thông tin đồng hồ</h1>`)})
router.get('/:id', verifyToken, waterMeterController.show)

router.get('/home/:homeId/addWaterMeter', verifyToken, waterMeterController.add)
router.post('/create', verifyToken, waterMeterController.create)

router.put('/:id', verifyToken, waterMeterController.update)

router.delete('/:id', verifyToken, waterMeterController.delete)

// Các api chưa dùng đến
// router.get('/:id/home', waterMeterController.homeOfWaterMeter)

module.exports = router
