


var express = require('express');
var router = express.Router();

router.post('/signup', function (req, res) {
   
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

module.exports = router; 