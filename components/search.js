
const { SEARCH_LIMIT, SEARCH_DISTANCE } = require('../constants/index');
const { dbQuery } = require('../db');

async function search({ latitude = 0 , longitude = 0, distance = SEARCH_DISTANCE, query = '', skip = 0, limit = SEARCH_LIMIT} ) {
    try {

        // query query contents
        const queryFormat = query.replace(' ', '|');
        const queryObject = (query.length) ? { $or: [
            { name : {  $regex: queryFormat } }, 
            { neighborhood : {  $regex: queryFormat } }, 
            { room_type : {  $regex: queryFormat } }, 
        ]} : {};

        // geospatial query
        if (latitude && longitude && distance) {
            queryObject.location = { $near:
               {
                   $geometry: { type: 'Point',  coordinates: [ parseFloat(longitude), parseFloat(latitude) ] },
                   $minDistance: 0,
                   $maxDistance: parseInt(distance)
               }
            };
        }

        return await dbQuery('properties', queryObject, skip, limit);
    } catch (error) {
        throw new Error(`searchHomes error ${error}`);
    }
}

module.exports.search = search;