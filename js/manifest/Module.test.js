/*global dessert, troop, sntls, bookworm, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Module", {
        setup: function () {
            grocer.Module.clearInstanceRegistry();
        },

        teardown: function () {
            grocer.Module.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        raises(function () {
            grocer.Module.create();
        }, "should raise exception on absent arguments");

        var module = grocer.Module.create('foo');

        ok(module.entityKey.equals('module/foo'.toDocumentKey()), "should set entityKey property");
        strictEqual(grocer.Module.create('foo'), module, "should return same instance for same moduleName");
        notStrictEqual(grocer.Module.create('bar'), module,
            "should return different instance for different moduleName");
    });

    test("Conversion from string", function () {
        var module = 'foo'.toModule();

        ok(module.isA(grocer.Module), "should return Module instance");
        ok(module.entityKey.equals('module/foo'.toDocumentKey()), "should set entityKey property");
    });

    test("Asset list getter", function () {
        bookworm.entities
            .appendNode('document>module'.toPath(), {
                "foo": {
                    "parent": "libraries",

                    "assets": {
                        "js": [
                            "src/foo1.js",
                            "src/foo2.js"
                        ],

                        "css": [
                        ]
                    }
                }
            });

        var module = 'foo'.toModule(),
            assets;

        assets = module.getAssetsForType('js');

        ok(assets.isA(grocer.AssetCollection), "should return AssetCollection instance");
        deepEqual(assets.items, [
            "src/foo1.js".toAsset('js'),
            "src/foo2.js".toAsset('js')
        ], "should return collection with Asset instances");
    });

    test("Loaded flag tester", function () {
        var module = 'foo'.toModule(),
            result = {};

        grocer.ModuleDocument.addMocks({
            getLoaded: function () {
                ok(this.entityKey.equals('module/foo'.toDocumentKey()),
                    "should fetch loaded flag from document");
                return result;
            }
        });

        strictEqual(module.isLoaded(), result, "should return whatever is stored in the document");

        grocer.ModuleDocument
            .removeMocks()
            .addMocks({
                getLoaded: function () {
                    return undefined;
                }
            });

        equal(module.isLoaded(), false, "should return false by default");

        grocer.ModuleDocument.removeMocks();
    });

    test("Loaded flag setter", function () {
        expect(3);

        var module = 'foo'.toModule();

        grocer.ModuleDocument.addMocks({
            setLoaded: function (loaded) {
                ok(this.entityKey.equals('module/foo'.toDocumentKey()),
                    "should set loaded flag on ");
                equal(loaded, true, "should set loaded flag to true");
            }
        });

        strictEqual(module.markAsLoaded(), module, "should be chainable");

        grocer.ModuleDocument.removeMocks();
    });

    test("Conversion to asset", function () {
        var module = 'foo'.toModule(),
            result;

        bookworm.entities
            .setNode('document>module'.toPath(), {
                "foo": {
                    "parent": "libraries",

                    "assets": {
                        "js": [
                            "src/foo1.js"
                        ],

                        "css": [
                        ]
                    }
                }
            });

        raises(function () {
            module.toAsset();
        }, "should raise exception on missing argument");

        equal(typeof 'bar'.toModule().toAsset('js'), 'undefined',
            "should return undefined when module has no associated document in manifest");
        equal(typeof module.toAsset('css'), 'undefined',
            "should return undefined when module has no assets of the specified type");

        result = module.toAsset('js');
        ok(result.isA(grocer.Asset), "should return Asset instance");
        equal(result.assetPath, 'foo.js', "should set assetPath property");
        equal(result.assetType, 'js', "should set assetType property");
    });
}());
