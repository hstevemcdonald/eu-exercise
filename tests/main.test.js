const { search } = require('../components/search');
const { SEARCH_LIMIT } = require('../constants');
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const geo = require('geolib');

describe('search', () => {
    test('When an empty search is performed, no more than max results are returned for pagination', async () => {
        const results = await search({});

        expect(results.length).toBeLessThanOrEqual(SEARCH_LIMIT);
    });

    test('When a query is provided, it will match results where text is found within a name or neighbourhood: property', async () => {
        const query = 'Midtown Manhattan';
        const results = await search({query});
        const matchRegEx = new RegExp(query, 'i');

        expect(results.length).toBeGreaterThan(0);

        const partialMatches = [
            results.some(result => result.name.match(matchRegEx)),
            results.some(result => result.neighbourhood.match(matchRegEx)),
        ];

        expect(partialMatches).toContain(true);
    });
    
    test('When a longitude and latitude query is provided, the search will return results within the distance of the longitude and latitude provided', async () => {
        const longitude = -73.971802;
        const latitude = 40.761635;
        const query = 'Apartment';
        const distance = 100;
        const results = await search({latitude, longitude, query, distance});

        expect(results.length).toBeGreaterThan(0); 

        const matchRegEx = new RegExp(query, 'i');

        expect(results.some(result => result.name.match(matchRegEx))).not.toEqual(false); 

        const distanceCheck = geo.getDistance(
            { latitude, longitude },
            { latitude: results[0].location.coordinates[1], longitude: results[0].location.coordinates[0] }
        );

        expect(distanceCheck).toBeLessThanOrEqual(distance);
    });

    test('When invalid latitude and longitude location is used, no results are returned', async () => {
        const longitude = -1;
        const latitude = 1;
        const query = 'Apartment';
        const results = await search({latitude, longitude, query});

        expect(results.length).toEqual(0); 
    });

    test('When invalid latitude and longitude location is used, error code is returned', async () => {
        const longitude = "!297a87z--";
        const latitude = "!297a87z--";

        await expect(search({latitude, longitude})).rejects.toThrow()
    });
});

describe('API', () =>{
    test('When a valid latitude and longitude is used along with a query, at least one result is returned', async () => {
        const query = {
            'latitude': 40.7306, 
            'longitude': -73.9352, 
            'distance': 1000, 
            'query': 'two bedroom'
        };
        const matchRegEx = new RegExp(query.query.replace(' ', '|'), 'i');
        const response = await request.post('/search').send();

        expect(response.body.some(result => result.name.match(matchRegEx))).toEqual(true);
        expect(response.statusCode).toBe(200);    
    });

    // TODO - with validation 
    // test('When invalid latitude and longitude location is used, error 400 is returned', async () => {
    // });   

    // done to handle supertest open port behavior
    test('When an API route is accessed that does not exist, error code 404 is returned', async (done) => {
        const response = await request.get('/foo');

        expect(response.statusCode).toEqual(404);
        done();
    });
});