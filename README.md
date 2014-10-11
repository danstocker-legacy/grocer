Grocer
======

*Front end asset manager*

The purpose of Grocer is to provide an API to

1. build Grunt config files based on a manifest file
2. impose modularity on the application, each module having an optional main object (function, class, etc.) that the application can invoke when the module is loaded

Manifest structure
------------------

The top level defines the modules. Within each module, there is a container for assets, separated by function (eg. JavaScript or CSS). Optionally, modules might define a `classPath`, that identifies the path (relative to the global object) that the application is supposed to invoke after loading the module.

    {
        "libraries": {
            "assets": {
                "js": [ "src/jquery.js" ]
            }
        },
        "common": {
            "assets": {
                "js": [ "src/app.js" ],
                "css": [ "src/app.css" ]
            }
        },
        "users": {
            "classPath": "app[\"pages\"].Users",
            "assets": {
                "js": [ "src/Users.js" ],
                "css": [ "src/Users.css" ]
            }
        }
    }

Usage
-----

Initializing manifest

    var manifest = grocer.Manifest.create(manifestJson);

Fetching asset list for module

    manifest.getAssetListForModule('common', 'js');

    /*
    [ "src/app.js" ]
    */

Fetching all assets from manifest

    manifest.getAssetList('js');

    /*
    [ "src/jquery.js", "src/app.js", "src/Users.js" ]
    */

Fetching script tag list from manifest

    manifest.getSerializedAssetList('js');

    /*
    <script src="src/jquery.js"></script>
    <script src="src/app.js"></script>
    <script src="src/Users.js"></script>
    */

    manifest.getSerializedAssetList('css');

    /*
    <link rel="stylesheet" href="src/app.css">
    <link rel="stylesheet" href="src/Users.css">
    */
