## Installation

- Clone repository:

  `$ git clone https://github.com/hstevemcdonald/eu-exercise.git`

- Copy or rename the file:

  `eu-exercise\.env.sample` to `eu-exercise\.env`

- Change values for `MONGO_DB_URL` and `MONGO_DB_NAME` to point to Mongo database for testing

- Enter app folder via console

  `$ cd eu-exercise`
  
- Install dependencies

  `$ yarn install`  

- Run seed operation on MongoDB database

  `$ yarn seed`

- Start server

  `$ yarn start`

- In a new console, run tests to confirm operations 

  `$ yarn test`

- In a new console, run client which will call API with two sample JSON objects (same as provided in instruction document) to see sample output of search results from API

  `$ yarn client`

- Optional: Make changes to tests in `eu-exercise\client.js` to test operations

Thank you for the opportunity! Please see my notes below on Requirements, Assumptions, Implementation Notes, Potential Improvements and Exceptions. Happy to expand on these in our next meeting.

## Requirements
- Provide location in lat/long and text
- Lat/long and text are optional
- Return array of listings
- Text should match partial listings (well should it)

## Assumptions
- Pagination of results
- Invalid values for lat/long will return error 400 (vs ignoring inputs) - TODO

## Implementation
- DB
    - MongoDB collection 'properties'
    - Use $near to ensure results are closest to farthest
    - Use GeoSpatial queries built-in to Mongo
    - Script to empty collection and then seed data

- API
    - GET query to /search with optional latitude, longitude, query, skip, limit
    - Returns array of results or empty array
    - Default pagination of results - start of 0 and limit

## Potential improvements / with more time
- Refactor MongoDB connection setup to use host, user, pass, port, dbname vs url + dbname
- Return message for counts, no results found message
- Ensure there are no duplicate property ids
- Implement schema validation on property records (and proper API 400 code)
- Use MongoDB pooling to seed data for faster performance
- Show 'inserted X of (total rows)' for better tracking of seed operation
- Text is evaluated for location data
- Clean up / close Mongo connection at end of tests
- Provide distance to location in results
- List of words/phrases to exclude from matching
- Ability to narrow results specifically by price, neighborhood, room type, min reviews, etc..

## Things that could go wrong:
- Common words like 'near' are not contextually relevant, but a word like 'shop' might be
- Need to mitigate risk of injection of malicious query data
