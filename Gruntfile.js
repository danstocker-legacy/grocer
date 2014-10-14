/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/manifest/ClassPathParser.js',
            'js/manifest/Asset.js',
            'js/manifest/Script.js',
            'js/manifest/Css.js',
            'js/manifest/Assets.js',
            'js/manifest/Module.js',
            'js/manifest/Manifest.js',
            'js/exports.js'
        ],

        test: [
            'js/manifest/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
