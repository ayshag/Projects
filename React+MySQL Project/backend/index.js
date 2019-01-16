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

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());
//
//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

var query = "query";
var srlist = [];

var printproperties = [];
var crypt = {};

var filename = "";
var counter = 0;
/*y
var nopoolcon = mysql.createConnection({
    host: 'localhost',
    //port: 3306,
    user: 'root',
    password: 'root',
    database: "lab1ha"
});


nopoolcon.connect(function (err) {
    console.log("Inside Connect");
    if (err) { throw err; }
    console.log("Connected");
}

);*/

crypt.createHash = function (data, successCallback, failureCallback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            failureCallback(err);
            return;
        }
        bcrypt.hash(data, salt, null, function (err, hash) {
            if (err) {
                failureCallback(err);
                return;
            }
            successCallback(hash);
        });
    });
};

crypt.compareHash = function (data, encrypted, successCallback, failureCallback) {
    bcrypt.compare(data, encrypted, function (err, isMatch) {
        if (err) {
            failureCallback(err);
            return;
        }
        successCallback(err, isMatch);
    });
};




const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        console.log("Accessing Storage");
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        
        counter++;
        const newFilename = filename + '_photo' + counter + '.jpg';
        console.log("New File Name: " + newFilename);
        callback(null, newFilename);
    },
});
const upload = multer({ storage });


app.post('/login', function (req, res) {
    console.log("Login Post Request");

    var loginquery = "select username,passwrd from users where username = '" + req.body.username + "'";
    console.log("Login Query: ", loginquery);
    var validated = null;

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {

            con.query(loginquery, function (err, result) {
                if (err) { throw err; }
              //  con.release();
                
                if (result[0] != null) {
                   
                    bcrypt.compare(req.body.password, result[0].passwrd, function (err, resp) {
                        if (resp) {
                            validated = true;

                        } else {
                            validated = false;
                        }
                        if (result[0].username === req.body.username && validated) {
                          
                            res.cookie('cookie', req.body.username, { httpOnly: false, path: '/' });
                            req.session.user = req.body.username;
                            console.log("Logged in as " + result[0].username);
                            res.end("Logged in as " + result[0].username);
                        }
                        else
                        {
                            console.log("User information invalid");
                            res.end("Failed");
                        }
                    });
                }
                else
                {
                    console.log("User information invalid");
                    res.end("Failed");
                }
            }
            )
        }
    });
});

app.post('/ownerlogin', function (req, res) {

    console.log("Inside Login Post Request");

    var loginquery = "select username,passwrd from users where username = '" + req.body.username + "'";
    console.log("Owner Login Query: ", loginquery)
    var validated = null;
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(loginquery, function (err, result) {
                if (err) { throw err; }
              //  con.release();
           
                if (result[0] != null) {

                    bcrypt.compare(req.body.password, result[0].passwrd, function (err, resp) {
                        if (resp) {
                            validated = true;

                        } else {
                            validated = false;
                        }
                        if (result[0].username == req.body.username && validated) {
                          
                            res.cookie('cookie', req.body.username, {httpOnly: false, path: '/' });
                            req.session.user = req.body.username;
                            console.log("Logged in as " + result[0].username);
                            res.end("Logged in as " + result[0].username);
                        }
                        else
                        {
                            console.log("User information invalid");
                            res.end("Failed");
                        }
                    });
                }
                else
                {
                    console.log("User information invalid");
                    res.end("Failed");
                }
            }
            )
        }
    });



}
);


app.get('/home', function (req, res) {

    console.log("Inside Get Home");
    //console.log(req.session.user);
    //res.writeHead(200, {
    //    'Content-Type': 'application/json'
    //});

    res.end();

});

function userbookingsqueryrun(result, srlist, userbookingquery, names, num1, num2) {
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(userbookingquery, function (err, userbookingresult) {
                if (err) { throw err; }
               // con.release();
                console.log("User Bookings Query: ", userbookingquery);
                console.log("User Bookings Result: ", userbookingresult);
                if (userbookingresult.length != 0) {
                    console.log("There are properties with previous bookings");

                    names = userbookingresult;
                    var add = true;
                    for (var i = 0; i < result.length; i++) {
                        add = true;
                        //Iterates through all names with owner dates matching
                        for (var j = 0; j < userbookingresult.length; j++) {
                            //Iterates through all names that have a trip
                            //compare.
                            if (result[i].propertyname == userbookingresult[j].propertyname) {
                                add = false;
                                //If for any name that exists in propertyname,also exists in userbookingresult, dont add.
                            }
                        }
                        if (add) {
                            srlist.push(mysql.escape(result[i].propertyname));
                        }
                        //For each result/name with owner dates matching, check if they have a usertrip. 
                    }
                    /*
                    for(var i = 0; i<result.length; i++)
                    {
                        for(var j = 0 ; j<userbooking.length;j++)
                        {
                            if(result[i]==userbooking.length)
                        }
                        //Check if propnames are in result but not in userbookingresult
                       console.log(result[i]);
                    }
                    console.log(names);*/
                    //For properties with previous bookings, check if dates match and then add
                    countqueriesrun(srlist, names, num1, num2, location, arrive, depart);
                }
                else {

                    console.log("There are no properties with previous bookings");
                }

            });
        }

    });
}

function countqueriesrun(srlist, names, num1, num2, location, arrive, depart) {
    for (var i = 0; i < names.length; i++) {
        var prvbookingsquery = "select count(*) as count from trips_booking where location = " + mysql.escape(location) + " and  propertyname = " + mysql.escape(names[i].propertyname);
        prvbookingqueryrun(srlist, prvbookingsquery, i, names, num1, num2, location, arrive, depart);
    
    }
}

function prvbookingqueryrun(srlist, prvbookingsquery, i, names, num1, num2, location, arrive, depart) {
    var prvtripsquery = "select count(*) as count from trips_booking where location = " + mysql.escape(location) + " and  propertyname = " + mysql.escape(names[i].propertyname) + " and (" + mysql.escape(depart) + " <  arrive or " + mysql.escape(arrive) + " >  depart) ";
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(prvbookingsquery, function (err, prvbookingsresult) {
               // con.release();
                if (err) { throw err; }
                num1 = prvbookingsresult[0].count;
           
                prvtripsqueryrun(srlist, prvtripsquery, i, names, num1, num2);

            });
        }
    })
}

function prvtripsqueryrun(srlist, prvtripsquery, i, names, num1, num2) {
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(prvtripsquery, function (err, prvtripsresult) {
                if (err) { throw err; }
              // con.release();
                num2 = prvtripsresult[0].count;
                if (num1 == num2) {
                    srlist.push(mysql.escape(names[i].propertyname));
                }
            });
        }
    })
}
app.post('/home', function (req, res) {
    console.log("Inside Post Home");
    location = req.body.destination; guests = req.body.guests; arrive = req.body.arrive; depart = req.body.depart;
    srlist = [];

    //Set Global DB Query (string) {select * from properties where location = req.body.destination, available = true, sleeps = req.body.guests};
    query = "select * from properties where location = " + mysql.escape(location) + " and sleeps = " + guests + " and " + mysql.escape(arrive) + " > availablestart and " + mysql.escape(depart) + " < availableend";
    console.log("Query Inside Post Home: ", query);
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(query, function (err, result) {
                if (err) { throw err; }
              //  con.release();
                if (result.length != 0) {

                    var userbookingquery = "select distinct propertyname from trips_booking where location = " + mysql.escape(location);
                   
                    var names = "";
                    var num1 = 0, num2 = 0;
                    userbookingsqueryrun(result, srlist, userbookingquery, names, num1, num2, location, guests, arrive, depart);
                }
                else {
                    console.log("No properties exist that user can book ");
                }
            });
        }
    })

    //   res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    //   res.end(JSON.stringify(result));
    // })

    res.end();

});
app.get('/signup', function (req, res) {

    console.log("Inside Get Signup");
    res.writeHead(200, {
        'Content-Type': 'plain/text'
    });

    res.end();

});

app.post('/signup', function (req, res) {
   
    console.log("Post Sign Up Request");
    var hashedpassword = "";
    var validateUniqueUsernameQuery = "SELECT username from users where username = " + mysql.escape(req.body.username);

    //Comment start for no pool
    pool.getConnection(function (err, con) {
         if (err) {
             res.writeHead(400, {
                'Content-Type': 'text/plain'
             })
             res.end("Could Not Get Connection Object Here");
        } else { //Comment end for no pool
         con.query(validateUniqueUsernameQuery, function (err, result) {
                 if (err) { throw err; }
              
                 if (result.length == 0) {
                    var hashsalt = bcrypt.genSalt(5, function (err, salt) {
                        return salt; });
                    bcrypt.hash(req.body.password, hashsalt, null, function (err, hash) {
                        
                        hashedpassword = hash;        
                        var signupquery = "INSERT INTO USERS VALUES ('" + req.body.username + "','" + hashedpassword + "','" + req.body.name + "',null,null,null,null,null,null,null,null,false,null,null,null)";

                        console.log("SignUp query: ", signupquery);
                        
                        con.query(signupquery, function (err, result) {
                                    if (err) { throw err; }
                                    con.release();
                                   
                                    res.cookie('cookie', req.body.username, { httpOnly: false, path: '/' });
                                    req.session.user = req.body.username;
                                    console.log("Logged in as " + req.body.username); 
                                    res.end("Logged in as " + req.body.username); });
                                 });
                                }
             
                 else {
                     console.log("UserName exists in Database");
                    res.end("Failed");
                    }
                });
           //Comment startfor no pool
         }
                }
                
             
            ) //Commment end foor no pool
      //  }
    //})

});

app.get('/ownersignup', function (req, res) {

    console.log("Inside Get OwnerSignup");
    res.writeHead(200, {
        'Content-Type': 'plain/text'
    });
    res.end();
});


app.post('/ownersignup', function (req, res) {
    console.log(" Post OwnerSign Up Request");
    var hashedpassword = "";
   
    var validateUniqueUsernameQuery = "SELECT username from users where username = " + mysql.escape(req.body.username);

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(validateUniqueUsernameQuery, function (err, result) {
                
                if (err) { throw err; }
               
                if (result.length == 0) {
                    var hashsalt = bcrypt.genSalt(5, function (err, salt) {
                        return salt;
                    });
                    bcrypt.hash(req.body.password, hashsalt, null, function (err, hash) {
                        hashedpassword = hash;

                        var signupquery = "INSERT INTO USERS VALUES ('" + req.body.username + "','" + hashedpassword + "','" + req.body.name + "'," + req.body.phone + ",null,null,null,null,null,null,null,true,null,null,null)";
                        console.log("Owner Signup Query: ", signupquery);
                        
                                con.query(signupquery, function (err, result) {
                                    if (err) { throw err; }
                                  //  con.release();

                                    res.cookie('cookie', req.body.username, { httpOnly: false, path: '/' });
                                    req.session.user = req.body.username;
                                    console.log("Logged in as " + req.body.username);
                                    res.end("Logged in as " + req.body.username);
                                })
                            })
                       
                }
                else {
                    console.log("UserName exists in Database");
                    res.end("Failed");
                }
            });
        }
    })
    
});

app.post('/postproperty',/*upload.single('selectedFile'),*/ function (req, res) {

    console.log("Inside Post Property Request");

    let bedrooms = null, bathrooms = null, pricing = null;

    if (req.body.bedrooms != '')
        bedrooms = req.body.bedrooms;
    if (req.body.bathrooms != '')
        bathrooms = req.body.bathrooms;
    if (req.body.pricing != '')
        pricing = req.body.pricing;
    var validateUniquePropnameQuery = "SELECT propertyname from properties where propertyname = " + mysql.escape(req.body.name);

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(validateUniquePropnameQuery, function (err, result) {
                if (err) { throw err; }
               // con.release();
                console.log("Running validate Unique Propname Query");
           
                if (result.length == 0) {
                    var postpropquery = "INSERT INTO properties VALUES(" + mysql.escape(req.body.location) + "," + mysql.escape(req.body.name) + "," + req.body.sleeps + "," + mysql.escape(req.body.type) + "," + bedrooms + "," + bathrooms + "," + pricing + "," + mysql.escape(req.body.amenities) + "," + mysql.escape(req.body.owner) + "," + mysql.escape(req.body.availableend) + "," + mysql.escape(req.body.availablestart) + ")";
                    
                    pool.getConnection(function (err, conn) {
                        if (err) {
                            res.writeHead(400, {
                                'Content-Type': 'text/plain'
                            })
                            res.end("Could Not Get Connection Object");
                        } else {
                            conn.query(postpropquery, function (err, result) {
                                if (err) { throw err; }
                                console.log("Property Posted");
                                conn.release();
                            })
                        }
                    })
                }
                else {
                    console.log('Property with same name exists in Database')
                    res.end("Failed");
                }

            })
        }
    })

    //res.end();
});

app.post('/setphotoname', (req, res) => {
    filename = req.body.filename;
    console.log("Setting name: ", filename);
    res.end();
})
/*
app.post('/uploadpropphoto', upload.single('selectedFile'), (req, res) => {
    //console.log("Req : ",req);
    console.log("Uploading Single File");
    console.log("Req.file", req.file);
    console.log("Req.body", req.body);
    console.log("Res : ", res.file);
    res.send();
});*/
app.post('/uploadpropphotos', upload.array('images[]', 10), (req, res) => {
    console.log("Uploading Multiple Files");
    counter = 0;
    res.send();
});
/*app.post('/uploadpropphoto', upload.single('selectedFile'), (req, res) => {
    //console.log("Req : ",req);
    console.log("Res : ",res.file);
    res.send();
});*/
/*
app.post('/postproperty/:file(*)', (req, res) => {
    console.log("Inside download file");
    var file = req.params.file;
    console.log(file);
    var fileLocation = path.join(__dirname + '/uploads', file);
    console.log(fileLocation);
    var img = fs.readFileSync(fileLocation);
    var base64img = new Buffer(img).toString('base64');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(base64img);
});


app.get('/searchresults/:file(*)', (req, res) => {
    console.log("Inside download file");
    var file = req.params.file;
    console.log(file);
    var fileLocation = path.join(__dirname + '/uploads', file);
    console.log(fileLocation);
    var img = fs.readFileSync(fileLocation);
    var base64img = new Buffer(img).toString('base64');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(base64img);
});
*/
///profile/:username
app.get('/profile/:username', function (req, res) {
    console.log("Geting User Profile");
    var profilequery = "SELECT * from users where username='" + req.params.username + "'";
    console.log("Profile Query: ", profilequery);
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(profilequery, function (err, result) {
                if (err) { throw err; }
               // con.release();
                console.log("User Profile Returned");

                res.end(JSON.stringify(result));
            })
        }
    })

});

app.post('/profile', function (req, res) {
    console.log("Updating User Profile");
    // res.writeHead(200,{
    //     'Content-Type' : 'application/json'
    // });
    var updateprofilequery = "update users set uname = " + mysql.escape(req.body.name) + ",phone=" + req.body.phone + ",aboutme=" + mysql.escape(req.body.aboutme) + ",city=" + mysql.escape(req.body.city) + ",country=" + mysql.escape(req.body.country) + ",school=" + mysql.escape(req.body.school) + ",hometown=" + mysql.escape(req.body.hometown) + ",languages=" + mysql.escape(req.body.languages) + ",gender=" + mysql.escape(req.body.gender) + " where username = " + mysql.escape(req.body.email);
    console.log("Update Profile Query: ", updateprofilequery);
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {

            con.query(updateprofilequery, function (err, result) {

                if (err) { throw err; }
              //  con.release();
                console.log("User Profile Updated");

            });
        }
    })
    res.end();

})
//var printproperties =[];
app.get('/searchresults', function (req, res) {

    console.log("Getting Search Results");

    printproperties = [];
  //  console.log( query);
 //   console.log("Returning properties with names : ", srlist.toString());
    var runquery = "";
    if (srlist.toString() == "")
        runquery = query;

    else
        runquery = "SELECT * FROM PROPERTIES WHERE propertyname IN (" + srlist.toString() + ");";

  //  console.log("Search Results Query: ",runquery);

    /* console.log("Inside download file");
     var file = req.params.file;
     var fileLocation = path.join(__dirname + '/uploads', file);
     var img = fs.readFileSync(fileLocation);
     var base64img = new Buffer(img).toString('base64');
     res.writeHead(200, { 'Content-Type': 'image/jpg' });
     res.end(base64img);*/

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(runquery, function (err, result) {
                if (err) { throw err; }
           //     con.release();
               
                printproperties = result;
                var next = true;
                for (var i = 0; i < printproperties.length; i++) {
                    var counter = 1; var imagecounter = 0;
                    next = true;
                    printproperties[i].images = [];
                    while (next) {
                        var file = printproperties[i].propertyname + '_photo' + counter + '.jpg';
    
                        var fileLocation = path.join(__dirname + '/uploads', file);
                        var img; var base64img;
                        try {
                            img = fs.readFileSync(fileLocation);
                            base64img = new Buffer(img).toString('base64');
                            printproperties[i].images[imagecounter] = base64img;
                            // printproperties[i].images = base64img;
                            //  console.log("Uploading file: ", file);
                            imagecounter++;
                            counter++;
                        }
                        catch
                        {
                        
                            next = false;
                        }

                    }

                    // res.writeHead(200, { 'Content-Type': 'image/jpg' });
                    //    printproperties.push
                    // res.end(base64img);


                }
                /*  for (var i = 0; i < printproperties.length; i++) {
                   // var file = printproperties[i].propertyname + '.jpg';
                    var file = printproperties[i].propertyname + '_photo1.jpg';
                    var fileLocation = path.join(__dirname + '/uploads', file);
                    var img = fs.readFileSync(fileLocation);
                    var base64img = new Buffer(img).toString('base64');
                    // res.writeHead(200, { 'Content-Type': 'image/jpg' });
                    //    printproperties.push
                    // res.end(base64img);
                    printproperties[i].image = base64img;
                    //  console.log(printproperties);
                    //console.log(base64img);
                }*/
                // console.log("PrintProperties from DB: ", JSON.stringify(printproperties));
                console.log("Search Results Returned");
                res.end(JSON.stringify(printproperties));
            }
            )
        }
    })


})

app.get('/getnext/:propertyname', function (req, res) {

    console.log(req.params.propertyname);
    var file = req.params.propertyname + '_photo2.jpg';
    console.log(file);
    var fileLocation = path.join(__dirname + '/uploads', file);
    var img = fs.readFileSync(fileLocation);
    var base64img = new Buffer(img).toString('base64');
    res.end(base64img);

});



/*
app.post('/searchresultsimages/:file(*)', (req, res) => {
    console.log("Inside download file");
    var file = req.params.file;
    var fileLocation = path.join(__dirname + '/uploads', file);
    var img = fs.readFileSync(fileLocation);
    var base64img = new Buffer(img).toString('base64');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(base64img);
});
*/
var propname = ""; var arrive = ""; var depart = ""; var guests = "";

app.post('/searchresults', function (req, res) {
    console.log("Post SearchResults");
    propname = req.body.name;
    arrive = req.body.arrive;
    depart = req.body.depart;
    guests = req.body.guests;
    
    res.end();
}
)
app.get('/details', function (req, res) {
    console.log("Getting details for property ",propname);
    

    var detailsquery = "SELECT * from properties where propertyname = '" + propname + "'";
    console.log("Property Details Query: ", detailsquery);

    var propdetails = [];
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(detailsquery, function (err, result) {
                if (err) { throw err; }
             //   con.release();
               
                propdetails = result;

                var tripend = depart.split('-');
                var tripenddate = new Date(tripend[0] - 1, tripend[1], tripend[2]);
                var tripstart = arrive.split('-');
                var tripstartdate = new Date(tripstart[0] - 1, tripstart[1], tripstart[2]);

                var days = Math.round((tripenddate - tripstartdate) / (1000 * 60 * 60 * 24)) + 1;
                var cost = days * propdetails[0].price * guests;
             

                var file = propdetails[0].propertyname + '_photo1.jpg';
                var fileLocation = path.join(__dirname + '/uploads', file);
                var img = fs.readFileSync(fileLocation);
                var base64img = new Buffer(img).toString('base64');
                // res.writeHead(200, { 'Content-Type': 'image/jpg' });
                //    printproperties.push
                // res.end(base64img);

                var counter = 1; var imagecounter = 0;
                next = true;
                propdetails[0].images = [];
                while (next) {
                    var file = propdetails[0].propertyname + '_photo' + counter + '.jpg';
                    console.log(file);
                    var fileLocation = path.join(__dirname + '/uploads', file);
                    var img; var base64img;
                    try {
                        img = fs.readFileSync(fileLocation);
                        base64img = new Buffer(img).toString('base64');
                        propdetails[0].images[imagecounter] = base64img;
                        // printproperties[i].images = base64img;
            
                        imagecounter++;
                        counter++;
                    }
                    catch
                    {
                        next = false;
                    }

                }

                
                propdetails[0].totalcost = cost;

                //  console.log("result", JSON.stringify(propdetails));
                //    res.writeHead(200,{
                //     'Content-Type' : 'application/json'
                //    });
                console.log("Returning Property " +propname +  " Details");
                res.end(JSON.stringify(propdetails));
         
            })
        }
    })

})

app.post('/details', function (req, res) {
    console.log("Post Details")
    console.log("Booking Property");

    let location = null, oname = null;

    var proplocownerquery = "select oname, location from properties where propertyname = " + mysql.escape(req.body.name);
    
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(proplocownerquery, function (err, resustlocowner) {
                if (err) { throw err; }
             //   con.release();
             
                location = resustlocowner[0].location;
                oname = resustlocowner[0].oname;
                var bookingquery = "INSERT INTO TRIPS_BOOKING VALUES (" + mysql.escape(oname) + "," + mysql.escape(req.body.user) + "," + mysql.escape(req.body.name) + "," + mysql.escape(location) + "," + mysql.escape(req.body.arrive) + "," + mysql.escape(req.body.depart) + "," + mysql.escape(req.body.guests) + "," + req.body.totalcost + ")";
                // var tripsquery = "UPDATE TRIPS_BOOKING SET username = "+mysql.escape(req.body.user)+",arrive="+mysql.escape(req.body.arrive)+",depart="+mysql.escape(req.body.depart)+",guests="+req.body.guests;
                console.log("Booking Property Query: ", bookingquery);

                con.query(bookingquery, function (err, result) {
                    if (err) { throw err; }
            
                }
                )
            })
        }
    })


    /*
    
    var bookpropquery = "UPDATE properties SET available = false where propertyname = " + mysql.escape(req.body.name);
    
     con.query(bookpropquery, function (err, result) {
         if (err) { throw err; }
         console.log("Running: ",bookpropquery);
         console.log("Booking Available Set to False");
     }
     )
     console.log(bookpropquery);
 */
    // var updatebookingquery = "INSERT INTO TRIPS_BOOKING VALUES ("+mysql.escape(req.body.owner)+",null,"+mysql.escape(req.body.name)+","+mysql.escape(req.body.location)+",null,null,null,null)";
    // console.log(updatebookingquery);
    // con.query(updatebookingquery, function (err, result) {
    //     if (err) { throw err; }})
    console.log("Property Booked Successfully");
    res.end("Property Booked Successfully");

})



app.get('/dashboard/:username', function (req, res) {
    console.log("Geting Traveler Dashboard");

    var tripsquery = "select propertyname,location,arrive,depart,guests, cost_income from trips_booking where username =  " + mysql.escape(req.params.username);
    console.log("Get Traveler Trips Query: ", tripsquery);
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {

            con.query(tripsquery, function (err, result) {
                if (err) { throw err; }
              //  con.release();
              
                var next = true;
                for (var i = 0; i < result.length; i++) {
                    var counter = 1; var imagecounter = 0;
                    next = true;
                    result[i].images = [];
                    while (next) {
                        var file = result[i].propertyname + '_photo' + counter + '.jpg';
                        console.log(file);
                        var fileLocation = path.join(__dirname + '/uploads', file);
                        var img; var base64img;
                        try {
                            img = fs.readFileSync(fileLocation);
                            base64img = new Buffer(img).toString('base64');
                            result[i].images[imagecounter] = base64img;
                            imagecounter++;
                            counter++;
                        }
                        catch
                        {
                            next = false;
                        }
                    }
                }
                console.log("Returning Traveler Trips");
                res.end(JSON.stringify(result));
            });
        }
    })
    /*
    for (var i = 0; i < result.length; i++) {
        var file = result[i].propertyname + '_photo1.jpg';
        var fileLocation = path.join(__dirname + '/uploads', file);
        var img = fs.readFileSync(fileLocation);
        var base64img = new Buffer(img).toString('base64');
        result[i].image = base64img;
        /*var file = printproperties[i].propertyname +'.jpg';
            var fileLocation = path.join(__dirname + '/uploads', file);
            var img = fs.readFileSync(fileLocation);
            var base64img = new Buffer(img).toString('base64');
       // res.writeHead(200, { 'Content-Type': 'image/jpg' });
   //    printproperties.push
   // res.end(base64img);
   printproperties[i].image = base64img;*/
    //}

    //  res.end(JSON.stringify(result));
    //});

})

app.get('/ownerdashboardprops/:username', function (req, res) {
    console.log("Getting Properties Owned by Owner");
    var propertiesquery = "select * from properties where oname  = " + mysql.escape(req.params.username);
    console.log("Owner properties query: ", propertiesquery);
 
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(propertiesquery, function (err, result) {
            //    con.release();
               
                var next = true;
                for (var i = 0; i < result.length; i++) {
                    var counter = 1; var imagecounter = 0;
                    next = true;
                    result[i].images = [];
                    while (next) {
                        var file = result[i].propertyname + '_photo' + counter + '.jpg';
                       
                        var fileLocation = path.join(__dirname + '/uploads', file);
                        var img; var base64img;
                        try {
                            img = fs.readFileSync(fileLocation);
                            base64img = new Buffer(img).toString('base64');
                            result[i].images[imagecounter] = base64img;
                            imagecounter++;
                            counter++;
                        }
                        catch
                        {
                            next = false;
                        }
                    }
                }
                console.log("Returning Owner Properties");
                res.end(JSON.stringify(result));
            })
        }
    })
});

app.get('/ownerdashboard/:username', function (req, res) {
    console.log("Getting properties owned by owner that are  booked by travelers");
    var bookingsquery = "select  * from trips_booking where oname =  " + mysql.escape(req.params.username);

   // var bookingsquery = "select * from trips_booking where propertyname not IN ('Name23','Name28') and oname =  " + mysql.escape(req.params.username);

    console.log("Bookings for owner query: ", bookingsquery);
    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        } else {
            con.query(bookingsquery, function (err, result) {

                if (err) { throw err; }
             //   con.release();
                var next = true;
                for (var i = 0; i < result.length; i++) {
                    var counter = 1; var imagecounter = 0;
                    next = true;
                    result[i].images = [];
                    while (next) {
                        var file = result[i].propertyname + '_photo' + counter + '.jpg';
                        console.log(file);
                        var fileLocation = path.join(__dirname + '/uploads', file);
                        var img; var base64img;
                        try {
                            img = fs.readFileSync(fileLocation);
                            base64img = new Buffer(img).toString('base64');
                            result[i].images[imagecounter] = base64img;
                            imagecounter++;
                            counter++;
                        }
                        catch
                        {
                            next = false;
                        }
                    }
                }
                console.log("Returnig owner properties booked by travelers");
                res.end(JSON.stringify(result));
            });
        }
    })

})
app.get('/getuseraccess/:username', function (req, res) {

    var username = req.params.username;
    var useraccessquery = "SELECT propowner from users where username = " + mysql.escape(username);
    console.log("Get User Access. Checking if user is owner");

    if (username != 'undefined') {
        pool.getConnection(function (err, con) {

            if (err) {
                res.writeHead(400, {
                    'Content-Type': 'text/plain'
                })
                res.end("Could Not Get Connection Object");
            } else {
                con.query(useraccessquery, function (err, result) {
                    if (err) { throw err; }
               //     con.release();
                 
                    if (result[0].propowner == 0) {
                        console.log("User is not owner");
                        res.end('traveler');
                    }
                    else if (result[0].propowner == 1) {
                        console.log("User is Owner");
                        res.end('owner');
                    }
                });

            }
        })
    }

})

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");