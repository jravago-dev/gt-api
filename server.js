const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const { serverPort, dbConnection } = require('./config')

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

require('./src/routes/account.routes')(app);


mongoose.connect(dbConnection, { useNewUrlParser: true })
    .then(() => console.log(`Connected to Database.`))
    .catch(error => {
        console.log(`Cannot connect to Database: ${error}`);
        process.exit()
    })

app.listen(serverPort || 5480, () => { console.log(`API ok.`) })