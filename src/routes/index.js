const userRouter = require('./user')
const waterMeterRouter = require('./waterMeter')
const authRouter = require('./auth')
const homeRouter = require('./home')
const statisticRouter = require('./statistic')
const { mongooseToObject } = require('../utils/mongoose')
const { verifyToken, verifyAdminAuth } = require('../app/controllers/MiddlewareController')
const { loginUser } = require('../app/controllers/AuthController')

function route(app) {

    // app.get('/', (req, res) => {
    //     res.render('home-page')
    // })

    function isAuthenticated(req, res, next) {
        if (req.session.user) next()
        else res.render('login', {
            isLoggedIn: false
        })
    }

    app.get('/', isAuthenticated, (req, res, next) => {
        // if(req.session.isLoggedIn) {

        res.render('home-page', {
            isLoggedIn: true
            // user: mongooseToObject(user)
        })

        // } else {
        //     res.render('login');
        // }
    })
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/home', homeRouter)
    app.use('/waterMeter', waterMeterRouter)
    app.use('/statistic', statisticRouter)
}

module.exports = route

