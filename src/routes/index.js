const usersRouter = require('./users')

function route(app) {
    
    app.get('/', (req, res) => {
        res.send('Hello World')
    })
    app.use('/users', usersRouter)
    
}

module.exports = route

