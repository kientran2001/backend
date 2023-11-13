const express = require('express')
const router = express.Router()

const waterMeterController = require('../app/controllers/WaterMeterController')

router.get('/', waterMeterController.showAll)
router.get('/:id', waterMeterController.show)

router.get('/home/:homeId/addWaterMeter', waterMeterController.add)
router.post('/create', waterMeterController.create)

router.put('/:id', waterMeterController.update)

router.delete('/:id', waterMeterController.delete)
router.get('/:id/home', waterMeterController.homeOfWaterMeter)

module.exports = router
