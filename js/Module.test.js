/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Module");

    test("Instantiation", function () {
        raises(function () {
            g$.Module.create();
        }, "should raise exception on absent arguments");

        raises(function () {
            g$.Module.create('foo');
        }, "should raise exception on invalid arguments");

        var module = g$.Module.create({
            classPath: 'foo["bar"].baz',
            assets   : {
                js: ['hello.js', 'world.js']
            }
        });

        ok(module.classPath.isA(sntls.Path), "initializes classPath as Path instance");
        ok(module.classPath.toString(), 'foo>bar>baz', "should set class path based on value in module node");

        ok(module.assetsCollection.isA(sntls.Collection), "should initialize collection of assets");
        equal(module.assetsCollection.getKeyCount(), 1, "should set 1 Assets instance in collection");
    });

    test("Getting assets by type", function () {
        var module = g$.Module.create({
                classPath: 'foo["bar"].baz',
                assets   : {
                    js: ['hello.js', 'world.js']
                }
            }),
            scripts = module.getAssets('js');

        ok(scripts.isA(g$.Assets), "should return Assets instance");
        deepEqual(
            scripts,
            ['hello.js', 'world.js'].toAssets('js'),
            "should return assets of specified type");
    });

    test("Getting asset list by type", function () {
        var module = g$.Module.create({
                classPath: 'foo["bar"].baz',
                assets   : {
                    js: ['hello.js', 'world.js']
                }
            }),
            scriptList;

        raises(function () {
            scriptList.getAssetList();
        }, "should raise exception on missing arguments");

        scriptList = module.getAssetList('js');

        deepEqual(
            scriptList,
            ['hello.js', 'world.js'],
            "should return array of asset IDs of the specified type");

        scriptList = module.getAssetList('foo');

        deepEqual(scriptList, [], "should return undefined for non-existing asset type");
    });
}());
