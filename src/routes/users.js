const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

router.post('/create', userController.create)
router.get('/:slug', userController.show)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)

module.exports = router
