'use strict';

var express = require('express');
var router = express.Router();

let crypto = require('crypto');

let users = require('../models/users');

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/staff-login', (req, res, next) => {
  let db = req.db;
  let username = req.body.username;
  let password = req.body.password;
  
  let _password = crypto.createHash('md5').update(password).digest('hex');
  
  users.staffLogin(db, username, _password)
    .then(total => {
      if (total) {
        console.log(total);
        req.session.username = username;
        res.send({ok: true})
      } else {
        res.send({ok: false, msg: 'Incorrect username/password'})
      }
    }, err => {
      res.send({ok: false, msg: err})
    });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/users/login');
});

/* GET users listing. */
router.post('/login', function(req, res, next) {
  let data = req.body;

  let username = data.username;
  let password = data.password;
  let key = data.key;

  let db = req.db;

  let _password = crypto.createHash('md5').update(password).digest('hex');
  console.log(_password);

  if (key) {
    users.checkKey(db, username, key)
    .then((user) => {
      console.log(user);

      if (user) {
        users.doLogin(db, username, _password)
          .then((data) => {
            console.log(data);

            if (data) {
              res.send({ok: true, user: data})
            } else {
              res.send({ok: false, msg: 'Invalid username/password'})
            }
          }, (err) => {
            res.send({ok: false, msg: err})
          })
      } else {
        res.send({ok: false, msg: 'Invalid key!'})
      }
    })
  } else {
    res.send({ok: false, msg: 'Key not found!'})
  }
});

module.exports = router;
