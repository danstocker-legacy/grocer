/*global dessert, troop, sntls, bookworm, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("DependencyPath");

    test("Path fragment extraction", function () {
        var dependencyPath = grocer.DependencyPath.create(['foo', 'bar', 'baz']),
            pathFragments = dependencyPath.getPathFragments();

        ok(pathFragments.isA(sntls.Collection), "should return Collection instance");
        deepEqual(pathFragments.items, {
            'foo'        : 'foo'.toPath(),
            'foo>bar'    : 'foo>bar'.toPath(),
            'foo>bar>baz': 'foo>bar>baz'.toPath(),
            'bar>baz'    : 'bar>baz'.toPath(),
            'baz'        : 'baz'.toPath()
        }, "should return unique fragment paths");
    });
}());
