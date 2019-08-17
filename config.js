require('dotenv').config();

module.exports = {
    // ENV vars here
    serverPort: process.env.PORT,
    dbConnection: process.env.NODE_ENV === 'development' ? process.env.MONGO_LOCAL : process.env.MONGO_PROD,
    gtSecret: process.env.SESSION_SECRET

}