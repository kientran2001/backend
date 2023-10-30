const express = require('express')
const router = express.Router()

const waterMeterController = require('../app/controllers/WaterMeterController')

router.get('/allWaterMeters', waterMeterController.showAll)
router.get('/:id', waterMeterController.show)
router.post('/create', waterMeterController.create)
router.put('/:id', waterMeterController.update)
router.delete('/:id', waterMeterController.delete)
router.get('/:id/user', waterMeterController.userOfWaterMeter)

module.exports = router
