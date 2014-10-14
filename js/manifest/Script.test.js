/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Script");

    test("Instantiation", function () {
        var asset = g$.Script.create('foo/bar');

        equal(asset.assetId, 'foo/bar', "should set asset ID");
        equal(asset.assetType, 'js', "should set asset type to js");
    });

    test("Asset surrogate", function () {
        var asset = g$.Asset.create('foo/bar', 'js');
        ok(asset.isA(g$.Script), "should return Script instance");
    });

    test("Serialization", function () {
        var asset = g$.Script.create('foo/bar');
        equal(
            asset.toString(),
            '<script src="foo/bar"></script>',
            "should return a script tag");
    });
}());
