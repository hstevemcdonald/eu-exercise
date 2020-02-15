require('dotenv').config();

module.exports = {
    SEARCH_LIMIT: process.env.SEARCH_LIMIT || 100,
    SEARCH_DISTANCE: process.env.SEARCH_DISTANCE || 1000,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
    MONGO_DB_USER_PASSWORD: process.env.MONGO_DB_USER_PASSWORD,
    MONGO_DB_HOST: process.env.MONGO_DB_HOST,
    MONGO_DB_PORT: process.env.MONGO_DB_PORT,
    MONGO_CLOSE_TIMER: process.env.MONGO_CLOSE_TIMER || 100
};