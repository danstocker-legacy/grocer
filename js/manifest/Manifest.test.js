/*global dessert, troop, sntls, bookworm, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Manifest", {
        setup: function () {
            grocer.Manifest.clearInstanceRegistry();
        },

        teardown: function () {
            grocer.Manifest.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var manifest = grocer.Manifest.create();
        ok(manifest.modules.isA(sntls.Collection), "should add modules property");
        strictEqual(grocer.Manifest.create(), manifest, "should be singleton");
    });

    test("Module asset getter", function () {
        bookworm.entities
            .setNode('document>module'.toPath(), {
                "common": {
                    "dependencies": ["libraries"],

                    "assets": {
                        "js": [
                            "src/app.js"
                        ],

                        "css": [
                        ]
                    }
                }
            });

        var manifest = grocer.Manifest.create();

        equal(manifest.getModulesAsAssets('js').toString(),
            [ 'common.js' ].join('\n'),
            "should fetch modules as individual assets");
    });

    test("Assets getter", function () {
        bookworm.entities
            .setNode('document>module'.toPath(), {
                "libraries": {
                    "assets": {
                        "js": [
                            "src/jquery.js"
                        ]
                    }
                },

                "common": {
                    "dependencies": ["libraries"],

                    "assets": {
                        "js": [
                            "src/app.js"
                        ],

                        "css": [
                        ]
                    }
                }
            });

        var manifest = grocer.Manifest.create();

        console.log(JSON.stringify(manifest.getAssets('js'), null, 2));

        deepEqual(
            manifest.getAssets('js'),
            [ "src/jquery.js", "src/app.js"].toAssetCollection('js'),
            "should return combined asset list for specified type");

        equal(
            manifest.getAssets('foo'),
            [].toAssetCollection('foo'),
            "should return empty asset collection for invalid type");
    });

    //    test("Flat assets getter", function () {
    //        var manifest = grocer.Manifest.create(manifestNode);
    //
    //        deepEqual(
    //            manifest.getFlatAssets('js'),
    //            [ "jquery.js", "app.js", "Users.js" ].toAssetCollection('js'),
    //            "should return combined flat asset list for specified type");
    //
    //        equal(
    //            manifest.getFlatAssets('foo'),
    //            [].toAssetCollection('foo'),
    //            "should return empty asset collection for invalid type");
    //    });
    //
    //    test("Serialized asset list getter", function () {
    //        var manifest = grocer.Manifest.create(manifestNode);
    //
    //        equal(
    //            manifest.getAssets('js').toString(),
    //            [
    //                "src/jquery.js".toAsset('js').toString(),
    //                "src/app.js".toAsset('js').toString(),
    //                "src/Users.js".toAsset('js').toString()
    //            ].join('\n'),
    //            "should return serialized asset list for specified type");
    //
    //        equal(
    //            manifest.getAssets('foo').toString(),
    //            '',
    //            "should return empty string for invalid type");
    //    });
    //
    //    test("Filtering by module names", function () {
    //        expect(2);
    //
    //        var manifest = grocer.Manifest.create(manifestNode),
    //            result = {};
    //
    //        grocer.Manifest.addMocks({
    //            create: function (manifestNode) {
    //                deepEqual(manifestNode, {
    //                    "libraries": {
    //                        "assets": {
    //                            "js": [ "src/jquery.js" ]
    //                        }
    //                    },
    //                    "users"    : {
    //                        "classPath": "app.pages.Users",
    //                        "assets"   : {
    //                            "js" : [ "src/Users.js" ],
    //                            "css": [ "src/Users.css" ]
    //                        }
    //                    }
    //                }, "should pass filtered manifest node to constructor");
    //                return result;
    //            }
    //        });
    //
    //        strictEqual(manifest.filterByModuleNames('libraries', 'users'), result,
    //            "return new Manifest instance based on filtered manifest node");
    //
    //        grocer.Manifest.removeMocks();
    //    });
}());
