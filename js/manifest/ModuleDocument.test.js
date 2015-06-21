/*global dessert, troop, sntls, bookworm, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ModuleDocument");

    test("Document surrogate", function () {
        var document = 'module/foo'.toDocument();
        ok(document.isA(grocer.ModuleDocument), "should return ModuleDocument instance");
    });

    test("Name getter", function () {
        equal('module/common'.toDocument().getModuleName(), 'common', "should return document ID");
    });

    test("Dependency list getter", function () {
        bookworm.entities
            .appendNode('document>module'.toPath(), {
                "common": {
                    "parent": "libraries"
                }
            });

        equal('module/common'.toDocument().getParent(), "libraries", "should return parent field value");
    });

    test("Symbol getter", function () {
        bookworm.entities
            .appendNode('document>module'.toPath(), {
                "common": {
                    "symbol": "Hello.World"
                }
            });

        equal('module/common'.toDocument().getSymbol(), 'Hello.World', "should return symbol field value");
    });

    test("Asset type tester", function () {
        bookworm.entities
            .appendNode('document>module'.toPath(), {
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

        var moduleDocument = 'module/common'.toDocument();

        ok(moduleDocument.hasAssetType('js'), "should return true for asset type that exist in the module");
        ok(!moduleDocument.hasAssetType('css'), "should return false for asset type that is empty");
        ok(!moduleDocument.hasAssetType('less'), "should return false for asset type that is undefined");
    });

    test("Asset getter", function () {
        bookworm.entities
            .appendNode('document>module'.toPath(), {
                "common": {
                    "parent": "libraries",

                    "assets": {
                        "js": [
                            "src/app.js"
                        ],

                        "css": [
                            "src/app.css"
                        ]
                    }
                }
            });

        var moduleDocument = 'module/common'.toDocument();

        deepEqual(moduleDocument.getAssetsForType('js'), ["src/app.js"], "should return corresponding attribute");
        equal(typeof moduleDocument.getAssetsForType('less'), 'undefined', "should return undefined for absent asset type");
    });
}());
