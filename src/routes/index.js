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
    // function isAuthenticated(req, res, next) {
    //     if (req.session.user) next()
    //     else res.render('login', {
    //         isLoggedIn: false
    //     })
    // }
    app.use('/app', appRouter)
    app.get('/', (req, res) => {
        res.redirect('/auth/login')
    })

    app.get('/homePage', verifyToken, (req, res, next) => {
        res.render('home-page', {
            isLoggedIn: true,
            admin: req.admin,
        })
    })
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/home', homeRouter)
    app.use('/waterMeter', waterMeterRouter)
    app.use('/statistic', statisticRouter)
}

module.exports = route

