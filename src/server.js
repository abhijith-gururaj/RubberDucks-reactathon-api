var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var graphqlStuff = require('./graphqlSchema')
var express_graphql = require('express-graphql');

// Create an express server and a GraphQL endpoint
var app = express();
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

app.use('/graphql', express_graphql({
    schema: graphqlStuff.schema,
    rootValue: graphqlStuff.resolver,
    graphiql: true
}));