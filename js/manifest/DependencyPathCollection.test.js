/*global dessert, troop, sntls, bookworm, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("DependencyPathCollection");

    test("Path fragment extraction", function () {
        var dependencyPathCollection = grocer.DependencyPathCollection.create([
                grocer.DependencyPath.create(['foo', 'bar', 'baz']),
                grocer.DependencyPath.create(['foo', 'hello', 'world'])
            ]),
            pathFragments = dependencyPathCollection.getPathFragments();

        ok(pathFragments.isA(sntls.Collection), "should return Collection instance");
        deepEqual(pathFragments.items, {
            'foo'            : 'foo'.toPath(),
            'foo>bar'        : 'foo>bar'.toPath(),
            'foo>bar>baz'    : 'foo>bar>baz'.toPath(),
            'foo>hello'      : 'foo>hello'.toPath(),
            'foo>hello>world': 'foo>hello>world'.toPath(),
            'bar>baz'        : 'bar>baz'.toPath(),
            'baz'            : 'baz'.toPath(),
            'hello>world'    : 'hello>world'.toPath(),
            'world'          : 'world'.toPath()
        }, "should return unique fragment paths");
    });
}());
