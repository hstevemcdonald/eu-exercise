const express = require('express');
const searchRouter = require('./routes/search');
const app = express();

app.use(express.json());
app.use(searchRouter);

app.use(function(req, res) {
    return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
});

app.use(function(error, req, res) {
    return res.status(500).json({ error: error.toString() });
});

module.exports = app;
