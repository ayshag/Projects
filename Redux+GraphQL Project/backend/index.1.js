//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var pool = require('./pool');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
const multer = require('multer');

const path = require('path');
const fs = require('fs');

var graphqlHTTP = require('express-graphql');
var {graphql,buildSchema} = require('graphql');

var schema = buildSchema(`type Query {
    hello: String
  }`);


  var root = {hello : () =>'Hello world!'};




//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 50 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));


app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

/*
graphql(schema, '{test}', root).then((response) =>
{
    console.log(response);
});
*/

app.use('/graphql', graphqlHTTP({schema : schema, root: root/*, graphiql : true*/}));

//start your server on port 3001
app.listen(3001, () => console.log('Test'));
console.log("Server Listening on port 3001");