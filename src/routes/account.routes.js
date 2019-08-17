module.exports = (app) => {
    const accountsController = require('../controllers/account.controller')

    app.post('/accounts/register', accountsController.registerAccount)
    app.post('/login', accountsController.login)
    app.get('/activate/:activationCode', accountsController.activateAccount)

}