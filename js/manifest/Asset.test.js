/*global dessert, troop, sntls, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Asset");

    test("Instantiation", function () {
        raises(function () {
            grocer.Asset.create();
        }, "should raise exception on absent arguments");

        var asset = grocer.Asset.create('foo/bar', 'baz');

        equal(asset.assetPath, 'foo/bar', "should set assetPath property");
        equal(asset.assetType, 'baz', "should set assetType property");
    });

    test("Conversion from string", function () {
        var asset = 'foo/bar'.toAsset('js');
        ok(asset.isA(grocer.Asset), "should return Asset instance");
        equal(asset.assetPath, 'foo/bar', "should set assetPath property");
        equal(asset.assetType, 'js', "should set asset type");
    });

    test("Prefixing", function () {
        var asset = 'foo/bar'.toAsset('js');

        strictEqual(asset.addPrefix('baz/'), asset, "should be chainable");
        equal(asset.assetPath, 'baz/foo/bar', "should prefix assetPath");
    });

    test("File name getter", function () {
        var asset = 'foo/bar.js'.toAsset('js');
        equal(asset.getAssetFileName(), 'bar.js', "should return file name part of path");
    });

    test("File base name getter", function () {
        var asset = 'foo/bar.js'.toAsset('js');
        equal(asset.getAssetBaseName(), 'bar', "should return file base name part of path");
    });

    test("File extension getter", function () {
        var asset = 'foo/bar.js'.toAsset('js');
        equal(asset.getAssetExtension(), 'js', "should return file extension part of path");
    });
}());
