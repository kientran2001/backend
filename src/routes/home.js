const express = require('express')
const router = express.Router()

const homeController = require('../app/controllers/HomeController')

router.get('/', homeController.showAll)
// router.get('/:id', homeController.show)
router.get('/home-details/:id', homeController.homeDetails)

router.get('/add', homeController.add)
router.post('/create', homeController.create)

router.put('/:id', homeController.update)
router.delete('/:id', homeController.delete)
router.get('/user-of-home/:id', homeController.userOfHome)
router.get('/waterMeter-of-home/:id', homeController.waterMeterOfHome)

module.exports = router
