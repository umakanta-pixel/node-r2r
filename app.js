const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('welcome'))
app.use('/api/v2', require('./routes/routes'));

module.exports = app;