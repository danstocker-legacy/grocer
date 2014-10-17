/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CustomTask");

    test("Instantiation", function () {
        var task = g$.CustomTask.create('foo');

        ok(task.hasOwnProperty('customHandler'), "should add customHandler property");
        equal(typeof task.customHandler, 'undefined', "should set customHandler property to undefined");
    });

    test("Conversion from string", function () {
        var task = 'foo'.toCustomTask();

        ok(task.isA(g$.CustomTask), "should return CustomTask instance");
        equal(task.taskName, 'foo', "should set task name");
    });

    test("Task registration", function () {
        expect(4);

        var task = g$.CustomTask.create('foo')
            .setCustomHandler(function () {
            });

        g$.GruntProxy.addMocks({
            registerTask: function (name, description, customHandler) {
                equal(name, 'foo', "should specify task name");
                equal(description, 'bar', "should pass description");
                strictEqual(customHandler, task.customHandler, "should pass custom handler");
            }
        });

        strictEqual(task.applyTask('bar'), task, "should be chainable");

        g$.GruntProxy.removeMocks();
    });

    test("Setting handler", function () {
        var task = g$.CustomTask.create('foo');

        function customHandler() {
        }

        raises(function () {
            task.setCustomHandler('foo');
        }, "should raise exception on invalid argument");

        strictEqual(task.setCustomHandler(customHandler), task, "should be chainable");
        strictEqual(task.customHandler, customHandler, "should set customHandler property");
    });
}());
