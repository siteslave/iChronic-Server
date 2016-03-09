"use strict";
let Q = require('q');

module.exports = {

  doLogin(db, username, password) {
    let q = Q.defer();

    db('users')
    .where({
      username: username,
      password: password
    })
    .limit(1)
    .then((rows) => {
      q.resolve(rows[0])
    })
    .catch((err) => {
      q.reject(err)
    });

    return q.promise;
  },

  checkKey(db, username, key) {
    let q = Q.defer();

    db('users')
    .where({
      username: username,
      api_key: key
    })
    .limit(1)
    .then((rows) => {
      q.resolve(rows[0])
    })
    .catch((err) => {
      q.reject(err)
    });

    return q.promise;
  }
};