/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Css");

    test("Instantiation", function () {
        var asset = g$.Css.create('foo/bar');

        equal(asset.assetId, 'foo/bar', "should set asset ID");
        equal(asset.assetType, 'css', "should set asset type to css");
    });

    test("Asset surrogate", function () {
        var asset = g$.Asset.create('foo/bar', 'css');
        ok(asset.isA(g$.Css), "should return Css instance");
    });

    test("Serialization", function () {
        var asset = g$.Css.create('foo/bar');
        equal(
            asset.toString(),
            '<link rel="stylesheet" href="foo/bar" />',
            "should return a link tag");
    });
}());
