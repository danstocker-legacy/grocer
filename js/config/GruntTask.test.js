/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntTask");

    test("Instantiation", function () {
        raises(function () {
            g$.GruntTask.create();
        }, "should raise exception on missing arguments");

        var task = g$.GruntTask.create('foo');

        equal(task.taskName, 'foo', "should set taskName property");
    });
}());
