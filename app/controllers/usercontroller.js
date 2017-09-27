var fs         = require('fs');
var express    = require('express');
var router     = express.Router();
var path       = require('path')
var db         = require("../models");
var bcrypt     = require('bcrypt');
var jwt        = require('jsonwebtoken');
var jwtexpress = require('jwt-express');
var cookieParser = require('cookie-parser');

const saltRounds = 10;

// Add a new user.
router.post('/new', function(req, res) {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    console.log(hash);
    req.body.hash = hash;
    db.User.create(req.body).then(function(data) {
      res.send(data);
    });
  });
});


// User login
router.post('/login', function(req, res) {
  console.log(req.cookies)

  console.log(req.body);
  // Load hash from your password DB.
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then(userRecord => {
    if (userRecord === null) {
      res.send("No user found.")
    } else {
      bcrypt.compare(req.body.password, userRecord.hash, function(err, response) {
        if (err) throw err;
        console.log(response);
        if (response) {
          //User is logeed in, send a JWT and we can go from here.
          //TODO Make sure this is an appropriate use of filesync.
          //TODO Is this an appropriate use of a private key? Should we use a string like "secret"?
          //TODO Set heroku environment variable config to keep our secret safe.
          var cert = fs.readFileSync(path.join(__dirname, '../../private.pem'));  // get private key

          // var jwt = res.jwt({
          //   user: userRecord.UserUuid,
          //   auth: 'true'
          //  });
          //  console.log(jwt);
          console.log(userRecord.uuid);

          jwt.sign({
            user: userRecord.uuid,
            auth: 'true'
          }, cert, function(err, token) {
            console.log(token);
            let options = {
              token: token,
              maxAge: 1000 * 60 * 60, // would expire after 1 hour
              httpOnly: true, // The cookie only accessible by the web server
              signed: true // Indicates if the cookie should be signed
          }
            res.cookie('cookiename', options) //TODO Setting a cookie....
            // res.set("authorization", token); // Set response header to the access token. //TODO: save this in local storage
            // res.end();
            res.redirect("/dashboard");
            // res.send(`Welcome ${userRecord.firstname}! You are successfully logged in.`)
          });
        } else {
          //Wrong password.
          res.send(`Wrong password! Try again.`)
        }
      });
    }
  });
});

module.exports = router;
