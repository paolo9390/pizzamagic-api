// FileName: index.js
// Import express
let express = require('express');

// Initialize the app
const app = express();

// add cors
const cors = require('cors')
require('./db/db')

// Setup server port
let http = require('http');
let https = require('https');
const port = process.env.PORT || 3000;


// allow cross origin requests from STMUCC CLIENT
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Launch app to listen to specified port
// app.listen(port, function () {
//      console.log('Running StMUCC RestAPI on port ' + port);
// });
http.createServer(app).listen(port, '0.0.0.0')
https.createServer(app).listen('3001', '0.0.0.0')

// Setup bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Import routes
let apiRoutes = require('./routes/index.route')

// Use Api routes in the App
app.use('/api', apiRoutes)
