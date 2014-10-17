/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PluginTaskCollection");

    test("Conversion from Array", function () {
        var tasks = [1, 2, 3].toPluginTaskCollection();

        ok(tasks.isA(g$.PluginTaskCollection), "should return PluginTaskCollection instance");
        deepEqual(
            tasks.items,
            [1, 2, 3],
            "should preserve contents");
    });

    test("Conversion from Hash", function () {
        var hash = [1, 2, 3].toHash(),
            tasks = hash.toPluginTaskCollection();

        ok(tasks.isA(g$.PluginTaskCollection), "should return PluginTaskCollection instance");
        deepEqual(
            tasks.items,
            [1, 2, 3],
            "should preserve contents");
    });

    test("Config node getter", function () {
        var tasks = [
            'foo'.toPluginTask({hello: "world"}),
            'bar'.toPluginTask({hi: "all"})
        ].toPluginTaskCollection();

        deepEqual(tasks.getConfigNode(), [
            {hello: "world"},
            {hi: "all"}
        ], "should return combined config nodes");

        deepEqual(tasks.getConfigNode('_'), [
            {_hello: "world"},
            {_hi: "all"}
        ], "should return combined config nodes with targets optionally prefixed");
    });

    test("Conversion to GruntConfig", function () {
        var tasks = [
                'foo'.toPluginTask({hello: "world"}),
                'bar'.toPluginTask({hi: "all"})
            ].toPluginTaskCollection(),
            config = tasks.toGruntConfig();

        ok(config.isA(g$.GruntConfig), "should return GruntConfig instance");
        deepEqual(config.items, [
            {hello: "world"},
            {hi: "all"}
        ], "should set config contents to config node based on tasks");

        deepEqual(tasks.toGruntConfig('_').items, [
            {_hello: "world"},
            {_hi: "all"}
        ], "should set config contents with targets optionally prefixed");
    });
}());
