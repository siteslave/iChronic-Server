'use strict';

let express = require('express');
let router = express.Router();

let _ = require('lodash');
let fse = require('fs-extra');
let rimraf = require('rimraf');
let path = require('path');
let fs = require('fs');
let moment = require('moment');

let apis = require('../models/apis');


/* GET users listing. */
router.post('/reports', function(req, res, next) {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  
  let cvds = [];
  let ckds = [];

  apis.getCkd(db, start, end)
    .then(rows => {
      let data = rows;
      let hospitals = _.uniqBy(data, 'HOSPCODE');
      hospitals.forEach(v => {
        let obj = {};
        obj.hospcode = v.HOSPCODE;
        obj.hospname = v.HOSPNAME;
        obj.state1 = 0;
        obj.state2 = 0;
        obj.state3 = 0;
        obj.state4 = 0;
        obj.state5 = 0;

        ckds.push(obj);
      });

      ckds.forEach(v => {
        data.forEach(i => {
          if (i.HOSPCODE == v.hospcode) {
            if (i.state == 1) v.state1 += i.total;
            if (i.state == 2) v.state2 += i.total;
            if (i.state == 3) v.state3 += i.total;
            if (i.state == 4) v.state4 += i.total;
            if (i.state == 5) v.state5 += i.total;
          }
        })
      });

      return apis.getCvd(db, start, end);

    })
    .then(rows => {
      let data = rows;
      let hospitals = _.uniqBy(data, 'HOSPCODE');
      hospitals.forEach(v => {
        let obj = {};
        obj.hospcode = v.HOSPCODE;
        obj.hospname = v.HOSPNAME;
        obj.state1 = 0;
        obj.state2 = 0;
        obj.state3 = 0;
        obj.state4 = 0;
        obj.state5 = 0;

        cvds.push(obj);
      });

      cvds.forEach(v => {
        data.forEach(i => {
          if (i.HOSPCODE == v.hospcode) {
            let _data = {};
            _data.age = i.AGE;
            _data.sex = i.SEX;
            _data.smoke = i.SMOKING;
            _data.whr = 0;
            _data.wc = i.WAIST * 2.5;
            _data.sbp = i.SBP;
            _data.tc = i.TC;
            _data.ldl = i.LDL;
            _data.hdl = i.HDL;
            _data.dm = i.DM;

            if (i.WAIST > 0 && i.HEIGHT > 0) { data.whr = data.wc / i.HEIGHT }
            let result = apis.getCVDState(_data.age, _data.smoke, _data.dm, _data.sbp, _data.sex, _data.tc, _data.ldl, _data.hdl, _data.whr, _data.wc);
            let percentage = result[1] * 100;

            // calculate state
            if (percentage < 10) {
              v.state1++;
            } else if (percentage >= 10 && percentage < 20) {
              v.state2++;
            } else if (percentage >= 20 && percentage < 30) {
              v.state3++;
            } else if (percentage >= 30 && percentage < 40) {
              v.state4++;
            } else if (percentage >= 40) {
              v.state5++;
            }

          }
        })
      });

      res.send({ok: true, ckds: ckds, cvds: cvds});

    }, err => {
    res.send({ok: false, msg: err})
  });

});

/* GET users listing. */
router.get('/reports/excel/:start/:end', function(req, res, next) {
  let db = req.db;
  let start = req.params.start;
  let end = req.params.end;

  console.log(req.params);

  let cvds = [];
  let ckds = [];

  apis.getCkd(db, start, end)
    .then(rows => {
      let data = rows;
      let hospitals = _.uniqBy(data, 'HOSPCODE');
      hospitals.forEach(v => {
        let obj = {};
        obj.hospcode = v.HOSPCODE;
        obj.hospname = v.HOSPNAME;
        obj.state1 = 0;
        obj.state2 = 0;
        obj.state3 = 0;
        obj.state4 = 0;
        obj.state5 = 0;

        ckds.push(obj);
      });

      ckds.forEach(v => {
        data.forEach(i => {
          if (i.HOSPCODE == v.hospcode) {
            if (i.state == 1) v.state1 += i.total;
            if (i.state == 2) v.state2 += i.total;
            if (i.state == 3) v.state3 += i.total;
            if (i.state == 4) v.state4 += i.total;
            if (i.state == 5) v.state5 += i.total;
          }
        })
      });

      return apis.getCvd(db, start, end);

    })
    .then(rows => {
      let data = rows;
      let hospitals = _.uniqBy(data, 'HOSPCODE');
      hospitals.forEach(v => {
        let obj = {};
        obj.hospcode = v.HOSPCODE;
        obj.hospname = v.HOSPNAME;
        obj.state1 = 0;
        obj.state2 = 0;
        obj.state3 = 0;
        obj.state4 = 0;
        obj.state5 = 0;

        cvds.push(obj);
      });

      cvds.forEach(v => {
        data.forEach(i => {
          if (i.HOSPCODE == v.hospcode) {
            let _data = {};
            _data.age = i.AGE;
            _data.sex = i.SEX;
            _data.smoke = i.SMOKING;
            _data.whr = 0;
            _data.wc = i.WAIST * 2.5;
            _data.sbp = i.SBP;
            _data.tc = i.TC;
            _data.ldl = i.LDL;
            _data.hdl = i.HDL;
            _data.dm = i.DM;

            if (i.WAIST > 0 && i.HEIGHT > 0) { data.whr = data.wc / i.HEIGHT }
            let result = apis.getCVDState(_data.age, _data.smoke, _data.dm, _data.sbp, _data.sex, _data.tc, _data.ldl, _data.hdl, _data.whr, _data.wc);
            let percentage = result[1] * 100;

            // calculate state
            if (percentage < 10) {
              v.state1++;
            } else if (percentage >= 10 && percentage < 20) {
              v.state2++;
            } else if (percentage >= 20 && percentage < 30) {
              v.state3++;
            } else if (percentage >= 30 && percentage < 40) {
              v.state4++;
            } else if (percentage >= 40) {
              v.state5++;
            }

          }
        })
      });

      let dataJson = {};
      dataJson.ckd = ckds;
      dataJson.cvd = cvds;
      
      console.log(dataJson);
      
      let exportPath = path.join('./public/tmp/');
      let zipFile = path.join(exportPath, 'ckd-cvd-' + moment().format('x') + '.zip');
      
      let exportCVDFile = path.join(exportPath, 'cvd.xlsx');
      let exportCKDFile = path.join(exportPath, 'ckd.xlsx');
      let json2xls = require('json2xls');
      let xls = json2xls(ckds);
      let xls2 = json2xls(cvds);
      
      fse.ensureDirSync(exportPath);
      fs.writeFileSync(exportCVDFile, xls2, 'binary');
      fs.writeFileSync(exportCKDFile, xls, 'binary');

      let JSZip = require("jszip");
      let zip = new JSZip();
      zip.file("cvd.xlsx", fs.readFileSync(exportCVDFile));
      zip.file("ckd.xlsx", fs.readFileSync(exportCKDFile));

      let buffer = zip.generate({type:"nodebuffer"});

      fs.writeFile(zipFile, buffer, function(err) {
        if (err) {
          res.send({ok: false, msg: err})
        } else {
          res.download(zipFile, function () {
            //rimraf.sync(exportPath);
            fse.removeSync(zipFile);
          });

        }
      });
      
      //res.send({ok: true, ckds: ckds, cvds: cvds});

    }, err => {
      res.send({ok: false, msg: err})
    });

});

router.post('/log', (req, res, next) => {
  let db = req.db;
  apis.getLog(db)
    .then(rows => {
      res.send({ok: true, rows: rows})
    }, err => {
      res.send({ok: false, msg: err})
    })
  
});

module.exports = router;
