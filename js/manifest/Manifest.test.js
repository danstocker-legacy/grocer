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
                    "parent": "libraries",

                    "assets": {
                        "foo": [
                            "src/app.js"
                        ],

                        "css": [
                        ]
                    }
                }
            });

        var manifest = grocer.Manifest.create();

        equal(manifest.getModulesAsAssetsForType('foo').toString(),
            [ 'common.foo' ].join('\n'),
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
                    "parent": "libraries",

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

        deepEqual(
            manifest.getAssetsForType('js'),
            [ "src/jquery.js", "src/app.js"].toAssetCollection('js'),
            "should return combined asset list for specified type");

        equal(
            manifest.getAssetsForType('foo'),
            [].toAssetCollection('foo'),
            "should return empty asset collection for invalid type");
    });

    test("Flat assets getter", function () {
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
                    "parent": "libraries",

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

        deepEqual(
            manifest.getFlatAssets('js'),
            [ "jquery.js", "app.js" ].toAssetCollection('js'),
            "should return combined flat asset list for specified type");

        equal(
            manifest.getFlatAssets('foo'),
            [].toAssetCollection('foo'),
            "should return empty asset collection for invalid type");
    });
}());
