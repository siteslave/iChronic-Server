'use strict';

var express = require('express');
var router = express.Router();

var moment = require('moment');
var _ = require('lodash');
var fse = require('fs-extra');
var rimraf = require('rimraf');
var JSZip = require('jszip');
var fs = require('fs');
var path = require('path');

var imports = require('../models/imports');

var multer  = require('multer');
var uploadDir = './public/uploads';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fse.ensureDirSync(uploadDir);
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('file'), (req, res, next) => {
  //console.log(req.file);
  //console.log(req.body);

  let db = req.db;

  let filePath = req.file.path;
  let tmpDir = './extracted/' + moment().format('x');
  let zip = new JSZip();

  fse.ensureDirSync(tmpDir);

  let data = fs.readFileSync(filePath);
  zip.load(data);

  let dataVillage = zip.file("village.txt").asText();
  let dataDiag = zip.file("diag.txt").asText();
  var dataChronic = zip.file("chronic.txt").asText();
  var dataScreen = zip.file("screen.txt").asText();

  let villageFile = path.join(tmpDir, 'village.txt');
  let diagFile = path.join(tmpDir, 'diag.txt');
  let chronicFile = path.join(tmpDir, 'chronic.txt');
  let screenFile = path.join(tmpDir, 'screen.txt');

  fs.writeFileSync(villageFile, dataVillage);
  fs.writeFileSync(diagFile, dataDiag);
  fs.writeFileSync(chronicFile, dataChronic);
  fs.writeFileSync(screenFile, dataScreen);

  imports.village(db, villageFile)
    .then(() => {
      return imports.chronic(db, chronicFile);
    })
    .then(() => {
      return imports.diag(db, diagFile);
    })
    .then(() => {
      return imports.screen(db, screenFile);
    })
    .then(() => {
      res.send({ok: true})
    }, (err) => {
    res.send({ok: false, msg: err})
  });
});

module.exports = router;
