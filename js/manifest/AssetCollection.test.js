/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("AssetCollection");

    test("Instantiation", function () {
        raises(function () {
            g$.AssetCollection.create({});
        }, "should raise exception on invalid arguments");
    });

    test("Conversion from Array", function () {
        var assets = ['foo/bar', 'hello/world'].toAssetCollection('baz');

        ok(assets.isA(g$.AssetCollection), "should return AssetCollection instance");
        deepEqual(
            assets,
            g$.AssetCollection.create(['foo/bar'.toAsset('baz'), 'hello/world'.toAsset('baz')]),
            "should initialize instance identically as through constructor");
    });

    test("Conversion from Hash", function () {
        var hash = [
                'foo/bar'.toAsset('baz'),
                'hello/world'.toAsset('baz')
            ].toHash(),
            assets = hash.toAssetCollection();

        ok(assets.isA(g$.AssetCollection), "should return AssetCollection instance");
        deepEqual(
            assets,
            g$.AssetCollection.create(['foo/bar'.toAsset('baz'), 'hello/world'.toAsset('baz')]),
            "should initialize instance identically as through constructor");
    });

    test("Asset list getter", function () {
        var assets = ['foo/bar', 'hello/world'].toAssetCollection('baz'),
            assetNames = assets.getAssetNames();

        deepEqual(assetNames, ['foo/bar', 'hello/world'], "should retrieve asset list array");
    });

    test("Serialization", function () {
        var assets = ['foo/bar', 'hello/world'].toAssetCollection('js');

        equal(
            assets.toString(),
            '<script src="foo/bar"></script>\n<script src="hello/world"></script>',
            "should return serialized assets concatenated");
    });
}());
