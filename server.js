require('babel-register');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const router = require('./routes/index.jsx');
const api = require('./api.js');

const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

// Use environment Vars
const app_port = 3771;
const apiUri = `http://localhost:${app_port}/api/`;

// Load Express Server
const app = express();
app.use('/', express.static('dist/public'));

// Parse HTTP Request Bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const schema = require('./graphql_schema.js');
app.use(
	'/api',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);
app.use(router);

//app.use('/api');

// Listen on the app port
app.listen(app_port, function() {
	console.log('Listening on port ' + app_port);
});
