var session = require('express-session');
var bodyParser = require('body-parser');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
var { users } = require('./models/user');
const cors = require('cors');
const app = express();
var bcrypt = require('bcrypt-nodejs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });


//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 50 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());
app.use("/graphql",graphqlHTTP({
    schema,
    graphiql: true
}));

/*
app.post('/login', function (req, res) {
    console.log(req.body);
    users.findOne({ username: req.body.username }, function (err, user) {
        console.log("Finding User");
        if (err) {
            console.log("Error: ", err);
        }
        else if (user) {

            bcrypt.compare(req.body.password, user.password, function (err, response) {

                if (response) {
                    console.log("Validated");
                    res.cookie('cookie', req.body.username, { httpOnly: false, path: '/' });

                } else {
                    console.log("Invalid Information");

             
                    
                }
            })
            
        }
        else {
            console.log("Username Does Not Exist");
          
        }
        res.end();
    })
});
  */


/*
app.use('/graphql', (req, res) => {
    return graphqlHTTP({
      schema,
      context: { req, res },
    })(req, res);
}
  );
*/
app.listen(8080, ()=>{
    console.log("GraphQL server started on port 8080");
})