const express = require('express')
const router = express.Router()

const statisticController = require('../app/controllers/StatisticController')

router.get('/all', statisticController.allLastStatistics)
router.get('/twoLastStatistic', statisticController.twoLastStatistic)
router.get('/calculateConsumption', statisticController.calculateConsumption)

router.post('/create', statisticController.create)

router.get('/statistic-of-home/:homeId', statisticController.statisticOfHome)

module.exports = router
