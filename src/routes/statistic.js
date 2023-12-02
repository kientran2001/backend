const express = require('express')
const router = express.Router()

const statisticController = require('../app/controllers/StatisticController')
const { verifyToken } = require('../app/controllers/MiddlewareController')


router.get('/consumption', verifyToken, statisticController.calculateConsumption)

router.get('/:waterMeterId/records', verifyToken, statisticController.allRecords)

// Các api chưa dùng đến
// router.post('/create', statisticController.create)
// router.get('/statistic-of-home/:homeId', statisticController.statisticOfHome)

module.exports = router
