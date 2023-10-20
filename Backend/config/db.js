const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DB: "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB,
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
    PORT: process.env.PORT ? process.env.PORT : 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_PORT: process.env.SMTP_PORT,
}