const express = require('express')
const router = express.Router()
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const waterMeterController = require('../app/controllers/WaterMeterController')

router.get('/', verifyToken, waterMeterController.showAll)
router.get('/:id', verifyToken, waterMeterController.show)

router.get('/home/:homeId/addWaterMeter', verifyToken, waterMeterController.add)
router.post('/create', verifyToken, waterMeterController.create)

router.put('/:id', verifyToken, waterMeterController.update)

router.delete('/:id', verifyToken, waterMeterController.delete)
router.get('/:id/home', verifyToken, waterMeterController.homeOfWaterMeter)

module.exports = router
