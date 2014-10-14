/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Class Path Parser");

    test("Parsing class path", function () {
        var classPath;

        classPath = g$.ClassPathParser.parseClassPath('foo.bar');
        ok(classPath.isA(sntls.Path), "should return Path instance");
        deepEqual(classPath.asArray, ['foo', 'bar'], "should set correct Path contents");

        classPath = g$.ClassPathParser.parseClassPath('foo[\'$bar\'].Baz');
        deepEqual(
            classPath.asArray,
            ['foo', '$bar', 'Baz'],
            "should deal with bracket notation and special characters");
    });

    test("Conversion from string", function () {
        var classPathString = 'foo["$bar"].Baz';

        deepEqual(
            classPathString.toPathFromClassPath(),
            g$.ClassPathParser.parseClassPath(classPathString),
            "should parse class path");
    });
}());
