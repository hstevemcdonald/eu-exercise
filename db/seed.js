const fs = require('fs');
const csv = require('csvtojson');
const { dbInsertMany, dbRemoveCollection, dbCreateCollection, dbCreateIndex } = require('./index');

if (process.argv.length <= 3) {
    throw new Error('Please supply collection name and data file:  yarn seed collectionName fileName');
}

const collectionName = process.argv[2];
const fileName = process.argv[3];

function onError(error) {
    throw new Error(`csvtojson error ${error}`);
}

async function onComplete() {
    console.log('creating location index');
    await dbCreateIndex(collectionName, { location: '2dsphere' });
    console.log('seed operation complete');
    process.exit(0);
}

async function seed() {
    try {
        if (fs.existsSync(fileName) && fs.lstatSync(fileName).isFile()) {        
            // first remove collection

            let batchSize = 500;
            let batch = [];
            const propertyIds = {};

            await dbRemoveCollection(collectionName);
            await dbCreateCollection(collectionName);
            await csv()
                .fromStream(fs.createReadStream(fileName))
                .subscribe(async (json)=>{
                    try {
                        if (!json.id || !json.longitude || !json.latitude || !json.name || propertyIds.hasOwnProperty(json.id)) { return; }

                        // setup location data
                        json.location = { type: "Point", coordinates: [ parseFloat(json.longitude), parseFloat(json.latitude) ] },
                        delete(json.longitude);
                        delete(json.latitude);

                        batch.push(json);
                        propertyIds[json.id] = true;
                        if (batch.length === batchSize) {
                            const insertCount = await dbInsertMany('properties', batch);
                            console.log(`Inserted ${insertCount} records`);
                            batch = [];
                        }         
                    } catch (error) {
                        console.error(`csv error ${error}`);
                    }
                },onError,onComplete);   
        } else {
            throw new Error(`file ${fileName} does not exist`);
        }
    } catch(error) {
        throw new Error(`seed error- ${error}`);
    }
}

seed().catch(error => {
    console.error(error);
});


