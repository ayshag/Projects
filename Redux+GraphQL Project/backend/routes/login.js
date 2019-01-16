


var express = require('express');
var router = express.Router();


router.post('/login', function (req, res) {
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

module.exports = router; 