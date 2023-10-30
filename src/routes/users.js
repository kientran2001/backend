const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

router.get('/allUsers', userController.showAll)
router.get('/:id', userController.show)
router.post('/create', userController.create)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)
router.get('/waterMeter-of-user/:id', userController.waterMetersOfUser)

module.exports = router
