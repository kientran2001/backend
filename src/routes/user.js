const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

router.get('/', userController.showAll)

router.get('/add', userController.add)
router.get('/:id', userController.show)


router.put('/:id', userController.update)

router.delete('/:id', userController.delete)
router.get('/homes-of-user/:id', userController.homesOfUser)

module.exports = router
