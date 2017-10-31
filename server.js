require('babel-register');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const router = require('./routes/index.jsx');
const bodyParser = require('body-parser');
const schema = require('./graphql_schema.js');

// Use environment Vars
const appPort = 3771;

// Load Express Server
const app = express();
app.use('/', express.static('dist/public'));

// Parse HTTP Request Bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/api', graphqlHTTP({ schema, graphiql: true }));
app.use(router);

// Listen on the app port
app.listen(appPort, () => {
  console.log(`Listening on port ${appPort}`);
});
