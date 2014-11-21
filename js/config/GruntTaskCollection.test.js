/*global dessert, troop, sntls, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntTaskCollection");

    test("Conversion from Array", function () {
        var tasks = [1, 2, 3].toGruntTaskCollection();

        ok(tasks.isA(grocer.GruntTaskCollection), "should return GruntTaskCollection instance");
        deepEqual(
            tasks.items,
            [1, 2, 3],
            "should preserve contents");
    });

    test("Conversion from Hash", function () {
        var hash = [1, 2, 3].toHash(),
            tasks = hash.toGruntTaskCollection();

        ok(tasks.isA(grocer.GruntTaskCollection), "should return GruntTaskCollection instance");
        deepEqual(
            tasks.items,
            [1, 2, 3],
            "should preserve contents");
    });
}());
