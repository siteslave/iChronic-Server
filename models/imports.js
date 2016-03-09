var Q = require('q'),
  moment = require('moment');

module.exports = {

  village: function (db, file) {
    var q = Q.defer();

    var sql = `
      LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE villages FIELDS
      TERMINATED BY "|" LINES TERMINATED BY "\r\n" IGNORE 1 ROWS
      (HOSPCODE, VILLAGE, VCODE, NAME, @UPDATED) SET UPDATED=STR_TO_DATE(@UPDATED, "%Y%m%d%H%i%s")
      `;
    db.raw(sql, [file])
      .then(function () {
        q.resolve();
      })
      .catch(function (err) {
        q.reject(err);
      });

    return q.promise;
  },

  chronic: function (db, file) {
    var q = Q.defer();

    var sql = `
      LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE chronic FIELDS
      TERMINATED BY "|" LINES TERMINATED BY "\r\n" IGNORE 1 ROWS
      (HOSPCODE,CID,PID,HN,PNAME,FNAME,LNAME,@BIRTH,SEX,BEGIN,VILLAGE,@UPDATED) SET BIRTH=STR_TO_DATE(@BIRTH, "%Y%m%d"), UPDATED=STR_TO_DATE(@UPDATED, "%Y%m%d%H%i%s")
      `;
    db.raw(sql, [file])
      .then(function () {
        q.resolve();
      })
      .catch(function (err) {
        q.reject(err);
      });

    return q.promise;
  },

  diag: function (db, file) {
    var q = Q.defer();

    var sql = `
      LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE diag FIELDS
      TERMINATED BY "|" LINES TERMINATED BY "\r\n" IGNORE 1 ROWS
      (HOSPCODE,HN,SEQ,DIAGCODE,DIAGTYPE,@UPDATED) SET UPDATED=STR_TO_DATE(@UPDATED, "%Y%m%d%H%i%s")
      `;
    db.raw(sql, [file])
      .then(function () {
        q.resolve();
      })
      .catch(function (err) {
        q.reject(err);
      });

    return q.promise;
  },

  screen: function (db, file) {
    var q = Q.defer();

    var sql = `
      LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE screen FIELDS
      TERMINATED BY "|" LINES TERMINATED BY "\r\n" IGNORE 1 ROWS
      (HOSPCODE,SEQ,HN,@DATE_SERV,TIME_SERV,BPD,BPS,HEIGHT,WEIGHT,TC,HDL,LDL,CREATININE,WAIST,SMOKING,DRINKING,@UPDATED)
      SET DATE_SERV=STR_TO_DATE(@DATE_SERV, "%Y%m%d"), UPDATED=STR_TO_DATE(@UPDATED, "%Y%m%d%H%i%s")
      `;
    db.raw(sql, [file])
      .then(function () {
        q.resolve();
      })
      .catch(function (err) {
        q.reject(err);
      });

    return q.promise;
  }
};