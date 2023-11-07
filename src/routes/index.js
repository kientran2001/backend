const userRouter = require('./user')
const waterMeterRouter = require('./waterMeter')
const authRouter = require('./auth')
const homeRouter = require('./home')
const statisticRouter = require('./statistic')

function route(app) {
    
    app.get('/', (req, res) => {
        res.render('home')
    })
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/home', homeRouter)
    app.use('/waterMeter', waterMeterRouter)
    app.use('/statistic', statisticRouter)
}

module.exports = route

