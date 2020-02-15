const MongoClient = require('mongodb').MongoClient;
const mongoUriBuilder = require('mongo-uri-builder');

const { MONGO_DB_USERNAME, MONGO_DB_USER_PASSWORD, MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_NAME, MONGO_CLOSE_TIMER } = require('../constants');

let mongoClientConnection = null, mongoCloseTimer = null;

function dbInsertMany(collection, data) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection required for MongoDB insert');
        }
        if (typeof data === 'undefined' || ! Array.isArray(data)) {
            return reject ('Data array required for MongoDB insertMany');
        }
        _getDbClient().then(db => {
            db.collection(collection).insertMany(data, function(error, result) {
                if (error) {
                    return reject(`dbInsert error ${error}`);
                }
                resolve(result.insertedCount);               
            });   
        }).catch(error => reject(error));
    });
}

function dbCreateCollection(collection) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection name required for MongoDB remove collection');
        }
        _getDbClient().then(db => {  
            db.createCollection(collection, function(error, result) {
                if (error) {
                    return reject(`dbRemoveCollection error ${error}`);
                }
                console.log(`Collection ${result.namespace} is created`);
                resolve(result);               
            });                
        }).catch(error => reject(error));
    });
}

function dbRemoveCollection(collection) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection name required for MongoDB remove collection');
        }
        _getDbClient().then(db => {          
            db.listCollections().toArray((error, list) => {
                if (Array.isArray(list) && list.map(collection => collection.name).includes(collection)) {
                    db.collection(collection).drop(function (error, result) {
                        if (error) {
                            return reject(`dbRemoveCollection error ${error}`);
                        } 
                        if (result) {
                            console.log(`dbRemoveCollection dropped collection ${collection}`);
                        }
                        resolve();
                    });
                } else {
                    console.error(`dbRemoveCollection collection ${collection} not found`);
                    resolve();
                }
            });            
        }).catch(error => reject(error));
    });
}

function dbQuery(collection, query = {}, skip = 0, limit = 0) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection required for MongoDB dbQuery');
        }
        _getDbClient().then(db => {    
            db.collection(collection).find(query).limit(limit).skip(skip).toArray(function(error, result) {
                if (error) {
                    return reject(`dbQuery error ${error}`);
                }
                resolve(result);               
            });                
        }).catch(error => reject(error));
    });
}


function dbCreateIndex(collection, index) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection required for MongoDB dbQuery');
        }
        _getDbClient().then(db => {   
            db.collection(collection).createIndex(index, function(error, result) {
                if (error) {
                    return reject(`dbCreateIndex error ${error}`);
                }
                resolve(result);               
            });             
        }).catch(error => reject(error));
    });
}

function _connect() {
    return new Promise((resolve, reject) => {
        const mongoConnectUri = mongoUriBuilder({
            username: MONGO_DB_USERNAME,
            password: MONGO_DB_USER_PASSWORD,
            host: MONGO_DB_HOST,
            port: MONGO_DB_PORT,
            database: MONGO_DB_NAME
        });
        const mongoClient = new MongoClient(mongoConnectUri, {  useUnifiedTopology: true, useNewUrlParser: true });
        mongoClient.connect().then(client => {
            mongoClient.on('close', function() {
                mongoClientConnection = null; 
                console.log('Mongo DB connection closed.');
            });
            resolve(client);
        }).catch(error => {
            reject(error);
        });
    }).catch(error => {
        throw new Error(error);
    });
}


function _getDbClient() {
    return new Promise((resolve, reject) => {
        if (mongoClientConnection === null) {
            _connect().then(client => {
                mongoClientConnection = client;
                resolve(mongoClientConnection.db(MONGO_DB_NAME));
                _setMongoTimeout();
            }).catch(error => {
                reject(error);
                _clearMongoTimeout();
            });
        } else {
            _setMongoTimeout();
            resolve(mongoClientConnection.db(MONGO_DB_NAME));
        }
    });    
}

function _clearMongoTimeout() {
    clearTimeout(mongoCloseTimer);
}

function _setMongoTimeout() {
    _clearMongoTimeout();
    mongoCloseTimer = setTimeout(() => {
        _closeDBClient();
    }, MONGO_CLOSE_TIMER);
}

function _closeDBClient() {
    return new Promise((resolve, reject) => {
        if (mongoClientConnection !== null) {
            mongoClientConnection.close().then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });        
        }
        resolve();
    });
}

module.exports.dbQuery = dbQuery;
module.exports.dbInsertMany = dbInsertMany;
module.exports.dbRemoveCollection = dbRemoveCollection;
module.exports.dbCreateCollection = dbCreateCollection;
module.exports.dbCreateIndex = dbCreateIndex;