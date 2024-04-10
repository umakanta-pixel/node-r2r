const express = require('express');
const cors = require('cors');
const app = express();
// var fs = require("fs");
// var morgan = require("morgan");
// var path = require("path");

app.use(express.json());
app.use(cors());

// var accessLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
//     flags: "a"
// });
// app.use(morgan("combined", { stream: accessLogStream }));

// app.get('/', (req, res) => res.send('welcome'))
// app.use('/api/v2', require('./routes/routes'));
app.use('/', require('./routes/routes'));

module.exports = app;