"use strict";

var JSZip = require('jszip');
var fs = require('fs');
var fse = require('fs-extra');

var data = fs.readFileSync('1456759355551-20160229222235.zip');

var zip = new JSZip();

var dir = './extracted';
fse.ensureDirSync(dir);

var dataZip = zip.load(data);
console.log(dataZip.files);

let _ = require('lodash');

//
//var dataVillage = zip.file("village.txt").asText();
////var dataDiag = zip.file("diag.txt").asText();
//var dataChronic = zip.file("chronic.txt").asText();
//fs.writeFileSync('./extracted/village.txt', dataVillage);
////fs.writeFileSync('./extracted/diag.txt', dataDiag);
//fs.writeFileSync('./extracted/chronic.txt', dataChronic);