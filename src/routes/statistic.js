const express = require('express')
const router = express.Router()

const statisticController = require('../app/controllers/StatisticController')
const { verifyToken } = require('../app/controllers/MiddlewareController')


router.get('/consumption', verifyToken, statisticController.calculateConsumption)

router.get('/:waterMeterId/records', verifyToken, statisticController.allRecords)

router.get('/:waterMeterId/add', verifyToken, statisticController.add)
router.post('/:waterMeterId/create', verifyToken, statisticController.create)

router.get('/:id/edit', verifyToken, statisticController.edit)
router.put('/:id/update', verifyToken, statisticController.update)

router.delete('/:id', verifyToken, statisticController.delete)


// Các api chưa dùng đến
// router.get('/statistic-of-home/:homeId', statisticController.statisticOfHome)

module.exports = router
