//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
//var bootstrap = require('bootstrap');
var mysql = require('mysql');


//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());
//
//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });



var result = "";
var calculating = "";
var input = "";

app.get('/',function(req,res){
   console.log('Inside / Get Request');
 
});
    app.post('/',function(req,res){
      
            input = req.body.input;
            calculating = calculating + input;
            
            
            if(input!="" && isNaN(input))
            {
                
                result = "";
                console.log("Invalid input entered");
                res.end("Please enter numerical values only");
            }
            else
            {
            if(result == "")
            {
                result = input;
                calculating = input;   
            }
            else
            {     
               
                if(operator == '+')
                {                
                    result = Number(result) + Number(input);
                    res.end(result +"");
                }
                else if(operator == '-')
                {                
                    result = Number(result) - Number(input);
                    res.end(result +"");
                }
                else if(operator == '*') 
                {               
                    result = Number(result) * Number(input);
                    res.end(result +"");
                }
                else if(operator == '/')   
                {        
                    if(Number(input)!=0)
                    {
                            result = Number(result) / Number(input);
                            res.end(result +"");
                    }
                    else
                    {
                        res.end("Cannot divide by 0")
                    }
                }

                
            }
            operator = req.body.operator;  
            calculating = calculating + operator;
            console.log("Calculating: ", calculating);

        
            console.log("Current Input, Operator: ",input,operator);
            console.log("Current Operation Result: ",result + "");
            
            if(operator=='=')
            {
              calculating = calculating + result; 

               console.log("Final Result: ", calculating);   
               res.end(result + "");
                result = "";

            }
              res.end();
        }
         });  
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");