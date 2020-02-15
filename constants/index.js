require('dotenv').config();

module.exports = {
    SEARCH_LIMIT: process.env.SEARCH_LIMIT || 100,
    SEARCH_DISTANCE: process.env.SEARCH_DISTANCE || 1000,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME
}