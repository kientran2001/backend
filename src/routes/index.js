require("dotenv").config();
const userRouter = require('./user')
const waterMeterRouter = require('./waterMeter')
const authRouter = require('./auth')
const homeRouter = require('./home')
const statisticRouter = require('./statistic')
const appRouter = require('./app')
const { mongooseToObject } = require('../utils/mongoose')
const { verifyToken, verifyStaffAuth, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const { loginUser } = require('../app/controllers/AuthController')

function route(app) {

    app.use('/app', appRouter)
    app.get('/', verifyToken, (req, res) => {
        return res.redirect('/statistic/consumption')
    })

    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/home', homeRouter)
    app.use('/waterMeter', waterMeterRouter)
    app.use('/statistic', statisticRouter)
}

module.exports = route

