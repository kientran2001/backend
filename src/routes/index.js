const usersRouter = require('./users')
const waterMetersRouter = require('./waterMeters')

function route(app) {
    
    app.get('/', (req, res) => {
        res.send('Hello World')
    })
    app.use('/users', usersRouter)
    app.use('/waterMeters', waterMetersRouter)
    
}

module.exports = route

