const express = require('express')
const router = express.Router()

const homeController = require('../app/controllers/HomeController')

router.get('/', homeController.showAll)
// router.get('/:id', homeController.show)
router.get('/home-details/:id', homeController.homeDetails)

router.get('/add', homeController.add)
router.post('/create', homeController.create)

router.get('/:id/edit', homeController.edit)
router.put('/:id/update', homeController.update)

router.delete('/:id', homeController.delete)

router.delete('/:homeId/deletePhone', homeController.deletePhoneNumber)
router.post('/:homeId/phone/:newPhoneNumber', homeController.addPhoneNumber)

router.get('/user-of-home/:id', homeController.userOfHome)
router.get('/waterMeter-of-home/:id', homeController.waterMeterOfHome)

module.exports = router
