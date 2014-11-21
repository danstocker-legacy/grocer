/*global dessert, troop, sntls, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Class Path Parser");

    test("Parsing class path", function () {
        var classPath;

        classPath = grocer.ClassPathParser.parseClassPath('foo.bar');
        ok(classPath.isA(sntls.Path), "should return Path instance");
        deepEqual(classPath.asArray, ['foo', 'bar'], "should set correct Path contents");

        classPath = grocer.ClassPathParser.parseClassPath('foo[\'$bar\'].Baz');
        deepEqual(
            classPath.asArray,
            ['foo', '$bar', 'Baz'],
            "should deal with bracket notation and special characters");
    });

    test("Conversion from string", function () {
        var classPathString = 'foo["$bar"].Baz';

        deepEqual(
            classPathString.toPathFromClassPath(),
            grocer.ClassPathParser.parseClassPath(classPathString),
            "should parse class path");
    });

    test("Conversion to class path (string)", function () {
        var classPath = ['foo', 'bar-bar', 'baz'].toPath();
        equal(classPath.toClassPath(), 'foo["bar-bar"].baz', "should return correct class path string");
    });
}());
