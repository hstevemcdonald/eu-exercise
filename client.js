const axios = require('axios');
const url = 'http://localhost:3000/search';

const tests = [
    { title: 'Test1', 
        json: {
            'latitude': 40.7306, 
            'longitude': -73.9352, 
            'distance': 1000, 
            'query': 'two bedroom',
            'limit': 5
        }},
    { title: 'Test2', 
        json: {
            'latitude': 41, 
            'longitude': -73, 
            'distance': 300, 
            'query': 'near the empire state building',
            'limit': 5
        }},
];

for (let test of tests) {
    axios.post(url, test.json)
        .then(function (response) {
            console.log(`#### ${test.title}`);
            console.log(response.data);
        })
        .catch(function (error) {
            console.error('Test {$test.title} error', error);
        });
}
