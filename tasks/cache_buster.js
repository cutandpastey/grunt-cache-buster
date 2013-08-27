/*
 * grunt-cache-buster
 * https://github.com/cutandpastey/cache-buster
 *
 * Copyright (c) 2013 Jon Parsons
 * Licensed under the MIT license.
 */


/*
 *   add all target action to queue suck that
 *   operations can be performed in sequence
 *
 * */


/*
 *   TODO --> THROW SOME EXCEPTIONS JAM FOOL
 * */

'use strict';

var fs = require('fs');
var crypto = require('crypto');
var Q = require('q');

module.exports = function (grunt) {
    grunt.registerMultiTask('cache_buster', 'Bust yo cache like a baws', function () {

        // ASYNC TASK
        var done = this.async();

        var targetList = this.data.targets;
        var promises = [];

        for (var key in targetList) {                       //  loop through all assets
            promises.push(cacheBustAsset(targetList[key]));
        }

        Q.all(promises).then(function(){
            done()
        });

    });
};

var cacheBustAsset = function (target) {
    var deferred = Q.defer()
    var fileName;

    var templateUrl = target.target;       //  path to html template
    var dest = target.dest;              //  destination html file to save
    var baseUrl = target.baseUrl;           //  base url to append
    var regex = target.regex


    var asset = target.asset;               //  path to asset file (js/css)

    if (asset !== null) {
        var assetClone = asset;                 // clone path to asset file (js/css)
        assetClone = assetClone.split('/')      // break into array
        var assetName = assetClone.pop();       //  asset name
        var assetPath = assetClone.join('/');   //  asset path

        console.log('Reading asset file', asset);
        getFileData(asset) // GET DATA AND MD5 HASH OF ALL DATA
            .then(function (result) {
                console.log('Writing asset file', newFilePath);
                var fileData = result[0];
                var md5Hash = result[1];
                fileName = md5Hash + '.' + assetName;
                var newFilePath = assetPath + '/' + fileName;

                return writeNewHashedFile(newFilePath, fileData)
            })
            .then(function () {
                console.log('Reading template file', templateUrl);
                return getFileData(templateUrl)
            })
            .then(function (result) {
                console.log('Writing template file', templateUrl);
                var fileData = result[0];
                var newUrl = baseUrl + '/' + fileName;
                var newFileData = fileData.replace(regex, newUrl);

                return writeNewHashedFile(dest, newFileData)
            })
            .done(function(){
                deferred.resolve({});
            })
    }
    //todo make this dry
    //  IF THE ASSET DOES NOT EXIST JUST WRITE THE BASE URL TO THE TEMPLATE
    else {
        console.log('Reading asset file', 'no asset');
        getFileData(templateUrl)
            .then(function (result) {
                console.log('Writing template file', templateUrl);
                var fileData = result[0];
                var newFileData = fileData.replace(regex, baseUrl);
                return writeNewHashedFile(dest, newFileData)
            })
            .done(function () {
                deferred.resolve({});
            })
    }
    return deferred.promise;
}

/*  ------------------------------------------------------------------
 *   READS A FILE AND RETURNS THE FILE DATA AND AN MD5 HAS OF THAT DATA
 *   ------------------------------------------------------------------ */
var getFileData = function (filePath) {
    var deferred = Q.defer();
    fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) deferred.reject(err);
        else {
            var hash = crypto.createHash('md5').update(data).digest("hex");
            deferred.resolve([data, hash]);
        }
    })
    return deferred.promise;
}

/*   ---------------------------------------------------
 *   WRITES THE NEW CACHE BUSTED FILE TO THE FILE SYSTEM
 *   --------------------------------------------------- */
var writeNewHashedFile = function (fileName, data) {
    var deferred = Q.defer();
    fs.writeFile(fileName, data, 'utf-8', function (err, data) {
        if (err) deferred.reject(err);
        else     deferred.resolve(true);
    })
    return deferred.promise;
}




