require('dotenv').config();

module.exports = {
    // ENV vars here
    serverPort: process.env.PORT,
    apiLink: process.env.NODE_ENV === 'development' ? process.env.API_LOCAL : process.env.API_PROD,
    dbConnection: process.env.NODE_ENV === 'development' ? process.env.MONGO_LOCAL : process.env.MONGO_PROD,
    appEmail: process.env.NODE_ENV === 'development' ? process.env.SENDGRID_EMAIL_STAGE : process.env.SENDGRID_EMAIL_PROD,
    sendgridSecret: process.env.NODE_ENV === 'development' ? process.env.SENDGRID_STAGE : process.env.SENDGRID_PROD,
    gtSecret: process.env.SESSION_SECRET,
    activationTemplateCode: process.env.SENDGRID_ACTIVATION_TEMPLATE


}