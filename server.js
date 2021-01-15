const express = require('express');
const cors = require('cors');
const crawler = require("./crawler")

const app = express();
const port = 3000;

app.use(cors());

const retrievedData = require("./data");

app.get('/data/age', (req, res) => {
    return res.send(retrievedData.age);
})

app.get('/data/gender', (req, res) => {
    return res.send(retrievedData.gender);
})

app.get('/data/race', (req, res) => {
    return res.send(retrievedData.race || {});
})

crawler.start();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})