const express = require('express')
const router = express.Router()
const appController = require('../app/controllers/AppController')

router.get('/hello', (req, res) => {
    res.status(200).send('Hello world')
})

router.post('/loginApp', appController.loginApp)
// router.get('/logout', appController.logOut)

module.exports = router
