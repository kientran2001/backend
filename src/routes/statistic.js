const express = require('express')
const router = express.Router()

const statisticController = require('../app/controllers/StatisticController')

// router.get('/', statisticController.showAll)
// router.get('/:id', statisticController.show)
router.post('/create', statisticController.create)
// router.put('/:id', statisticController.update)
// router.delete('/:id', statisticController.delete)
router.get('/statistic-of-home/:homeId', statisticController.statisticOfHome)

module.exports = router
