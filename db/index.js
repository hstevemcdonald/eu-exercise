const MongoClient = require('mongodb').MongoClient;
const { MONGO_DB_URL, MONGO_DB_NAME } = require('../constants');

async function dbInsertMany(collection, data) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection required for MongoDB insert');
        }
        if (typeof data === 'undefined' || ! Array.isArray(data)) {
            return reject ('Data array required for MongoDB insertMany');
        }
        _connect(MONGO_DB_URL).then(client => {
            const db = client.db(MONGO_DB_NAME);    
            db.collection(collection).insertMany(data, function(error, result) {
                if (error) {
                    return reject(`dbInsert error ${error}`);
                }
                client.close();
                resolve(result.insertedCount);               
            });                
        }).catch(error => reject(error));
    });
}

async function dbCreateCollection(collection) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection name required for MongoDB remove collection');
        }
        _connect(MONGO_DB_URL).then(client => {
            const db = client.db(MONGO_DB_NAME);    
            db.createCollection(collection, function(error, result) {
                if (error) {
                    return reject(`dbRemoveCollection error ${error}`);
                }
                client.close();
                console.log(`Collection ${result.namespace} is created`);
                resolve();               
            });                
        }).catch(error => reject(error));
    });
}

async function dbQuery(collection, query = {}, skip = 0, limit = 0) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection required for MongoDB dbQuery');
        }
        _connect(MONGO_DB_URL).then(client => {
            const db = client.db(MONGO_DB_NAME);    
            db.collection(collection).find(query).limit(limit).skip(skip).toArray(function(error, result) {
                if (error) {
                    return reject(`dbQuery error ${error}`);
                }
                client.close();
                resolve(result);               
            });                
        }).catch(error => reject(error))
    });
}

async function dbRemoveCollection(collection) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection name required for MongoDB remove collection');
        }
        _connect(MONGO_DB_URL).then(client => {
            const db = client.db(MONGO_DB_NAME);           
            db.listCollections().toArray((error, list) => {
                if (list.map(collection => collection.name).includes(collection)) {
                    db.collection(collection).drop(function (error, result) {
                        if (error) {
                            return reject(`dbRemoveCollection error ${error}`);
                        } 
                        if (result) {
                            console.log(`dbRemoveCollection dropped collection ${collection}`);
                        }
                        client.close();
                        resolve();
                    });
                } else {
                    console.error(`dbRemoveCollection collection ${collection} not found`);
                    client.close();
                    resolve();
                }
            });            
        }).catch(error => reject(error));
    });
}

async function dbCreateIndex(collection, index) {
    return new Promise((resolve, reject) =>{
        if (!collection) {
            return reject ('Collection required for MongoDB dbQuery');
        }
        _connect(MONGO_DB_URL).then(client => {
            const db = client.db(MONGO_DB_NAME);    
            db.collection(collection).createIndex(index, function(error, result) {
                if (error) {
                    return reject(`dbCreateIndex error ${error}`);
                }
                client.close();
                resolve(result);               
            });             
        }).catch(error => reject(error));
    });
}

async function _connect(url) {
    return new Promise((resolve, reject) => {
        const mongoClient = new MongoClient(url, {  useUnifiedTopology: true, useNewUrlParser: true });
        mongoClient.connect().then(client => {
            resolve(client);
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports.dbQuery = dbQuery;
module.exports.dbInsertMany = dbInsertMany;
module.exports.dbRemoveCollection = dbRemoveCollection;
module.exports.dbCreateCollection = dbCreateCollection;
module.exports.dbCreateIndex = dbCreateIndex;