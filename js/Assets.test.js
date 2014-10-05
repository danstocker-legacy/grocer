/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Assets");

    test("Instantiation", function () {
        raises(function () {
            g$.Assets.create();
        }, "should raise exception on missing arguments");

        raises(function () {
            g$.Assets.create('foo');
        }, "should raise exception on invalid arguments");

        var assetIds = ['foo/bar', 'hello/world'],
            assets = g$.Assets.create(assetIds, 'baz');

        ok(assets.assetCollection.isA(sntls.Collection), "should set asset collection");
        deepEqual(
            assets.assetCollection.items,
            [
                'foo/bar'.toAsset('baz'),
                'hello/world'.toAsset('baz')
            ],
            "should set contents of asset collection to asset instances based on asset IDs and type");
    });

    test("Conversion from Array", function () {
        var assets = ['foo/bar', 'hello/world'].toAssets('baz');

        ok(assets.isA(g$.Assets), "should return Assets instance");
        deepEqual(
            assets,
            g$.Assets.create(['foo/bar', 'hello/world'], 'baz'),
            "should initialize instance identically as through constructor");
    });

    test("Conversion from Hash", function () {
        var hash = ['foo/bar', 'hello/world'].toHash(),
            assets = hash.toAssets('baz');

        ok(assets.isA(g$.Assets), "should return Assets instance");
        deepEqual(
            assets,
            g$.Assets.create(['foo/bar', 'hello/world'], 'baz'),
            "should initialize instance identically as through constructor");
    });

    test("Serialization", function () {
        var assets = ['foo/bar', 'hello/world'].toAssets('js');

        equal(
            assets.toString(),
            '<script src="foo/bar"></script>\n<script src="hello/world"></script>',
            "should return serialized assets concatenated");
    });
}());
