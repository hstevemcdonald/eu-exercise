const express = require('express');
const router = express.Router();
const { search } = require('../components/search');

const { SEARCH_LIMIT, SEARCH_DISTANCE } = require('../constants');

/* POST search - To improvde, refactor with Joi to validate values when present*/
router.post('/search', async function(req, res, next) {
    let results;
    try {
        const latitude = req.body.latitude || '';
        const longitude = req.body.longitude || '';
        const query = req.body.query || '';
        const distance = req.body.distance || SEARCH_DISTANCE;
        const skip = req.body.skip || 0;
        const limit = req.body.limit || SEARCH_LIMIT;
        results = await search({ latitude, longitude, query, distance, skip, limit });
    } catch (error) {
        next(error);
    }
    return res.json(results);
});

module.exports = router;
