const usersRouter = require('./users')
const waterMetersRouter = require('./waterMeters')
const authRouter = require('./auth')

function route(app) {
    
    app.get('/', (req, res) => {
        res.send('Hello World')
    })
    app.use('/users', usersRouter)
    app.use('/waterMeters', waterMetersRouter)
    app.use('/auth', authRouter)
    
}

module.exports = route

