'use strict';

var express = require('express');
var router = express.Router();

let crypto = require('crypto');

let users = require('../models/users');

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
