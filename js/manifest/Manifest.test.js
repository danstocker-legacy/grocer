/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Manifest");

    var manifestNode = {
        "libraries": {
            "assets": {
                "js": [ "src/jquery.js" ]
            }
        },
        "common"   : {
            "assets": {
                "js" : [ "src/app.js" ],
                "css": [ "src/app.css" ]
            }
        },
        "users"    : {
            "classPath": "app[\"pages\"].Users",
            "assets"   : {
                "js" : [ "src/Users.js" ],
                "css": [ "src/Users.css" ]
            }
        }
    };

    test("Instantiation", function () {
        raises(function () {
            g$.Manifest.create();
        }, "should raise exception on absent arguments");

        raises(function () {
            g$.Manifest.create('foo');
        }, "should raise exception on invalid arguments");

        var manifest = g$.Manifest.create(manifestNode);

        ok(manifest.modules.isA(sntls.Collection), "should initialize modules collection");
        equal(manifest.modules.getKeyCount(), 3, "should set modules in collection");
    });

    test("Module getter", function () {
        var manifest = g$.Manifest.create(manifestNode),
            module;

        raises(function () {
            manifest.getModule();
        }, "should raise exception on missing arguments");

        module = manifest.getModule('common');

        ok(module.isA(g$.Module), "should return Module instance");
        deepEqual(
            module.assetsCollection,
            sntls.Collection.create({
                js : [ "src/app.js" ].toAssetCollection('js'),
                css: [ "src/app.css"].toAssetCollection('css')
            }));
    });

    test("Module asset getter", function () {
        var manifest = g$.Manifest.create(manifestNode);

        equal(
            manifest
                .getModulesAsAssets('js')
                .toString(),
            [
                '<script src="libraries.js"></script>',
                '<script src="common.js"></script>',
                '<script src="users.js"></script>'
            ].join('\n'),
            "should fetch modules as individual assets");
    });

    test("Asset list getter for module", function () {
        var manifest = g$.Manifest.create(manifestNode);

        deepEqual(
            manifest.getAssetListForModule('common', 'js'),
            [ "src/app.js" ],
            "should return asset list for specified module & type");

        deepEqual(
            manifest.getAssetListForModule('foo', 'js'),
            [],
            "should return empty asset list for invalid module");
    });

    test("Asset list getter", function () {
        var manifest = g$.Manifest.create(manifestNode);

        deepEqual(
            manifest.getAssetList('js'),
            [ "src/jquery.js", "src/app.js", "src/Users.js" ],
            "should return combined asset list for specified type");

        deepEqual(
            manifest.getAssetList('foo'),
            [],
            "should return empty asset list for invalid type");
    });

    test("Serialized asset list getter", function () {
        var manifest = g$.Manifest.create(manifestNode);

        equal(
            manifest.getSerializedAssetList('js'),
            [
                "src/jquery.js".toAsset('js').toString(),
                "src/app.js".toAsset('js').toString(),
                "src/Users.js".toAsset('js').toString()
            ].join('\n'),
            "should return serialized asset list for specified type");

        equal(
            manifest.getSerializedAssetList('foo'),
            '',
            "should return empty string for invalid type");
    });
}());
