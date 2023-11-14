const userRouter = require('./user')
const waterMeterRouter = require('./waterMeter')
const authRouter = require('./auth')
const homeRouter = require('./home')
const statisticRouter = require('./statistic')
const { mongooseToObject } = require('../utils/mongoose')
const { verifyToken, verifyAdminAuth } = require('../app/controllers/MiddlewareController')

function route(app) {

    app.get('/', (req, res) => {
        res.render('home-page')
    })

    // app.get('/', (req, res, next) => {
    //     if (req.session.isLoggedIn) {
    //         res.locals.isLoggedIn = true
    //         const user = req.user
    //         console.log('user:', user)
    //         res.render('home-page', {
    //             user: mongooseToObject(user)
    //         })
    //     } else {
    //         res.locals.isLoggedIn = false
    //         res.render('login')
    //     }
    // })
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/home', homeRouter)
    app.use('/waterMeter', waterMeterRouter)
    app.use('/statistic', statisticRouter)
}

module.exports = route

