/*global dessert, troop, sntls, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Css");

    test("Instantiation", function () {
        var asset = grocer.Css.create('foo/bar');

        equal(asset.assetPath, 'foo/bar', "should set assetPath property");
        equal(asset.assetType, 'css', "should set assetType to css");
    });

    test("Asset surrogate", function () {
        var asset = grocer.Asset.create('foo/bar', 'css');
        ok(asset.isA(grocer.Css), "should return Css instance");
    });

    test("Serialization", function () {
        var asset = grocer.Css.create('foo/bar');
        equal(
            asset.toString(),
            '<link rel="stylesheet" href="foo/bar" />',
            "should return a link tag");
    });
}());
