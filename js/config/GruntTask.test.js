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

        ok(task.hasOwnProperty('taskHandler'), "should add taskHandler property");
        equal(typeof task.taskHandler, 'undefined', "should set taskHandler property to undefined");
    });

    test("Conversion from string", function () {
        var task = 'foo'.toGruntTask();

        ok(task.isA(g$.GruntTask), "should return GruntTask instance");
        equal(task.taskName, 'foo', "should set task name");
    });

    test("Task registration", function () {
        expect(4);

        var task = g$.GruntTask.create('foo')
            .setTaskHandler(function () {
            });

        g$.GruntProxy.addMocks({
            registerTask: function (name, description, taskHandler) {
                equal(name, 'foo', "should specify task name");
                equal(description, 'bar', "should pass description");
                strictEqual(taskHandler, task.taskHandler, "should pass task handler");
            }
        });

        strictEqual(task.applyTask('bar'), task, "should be chainable");

        g$.GruntProxy.removeMocks();
    });

    test("Setting handler", function () {
        var task = g$.GruntTask.create('foo');

        function taskHandler() {
        }

        raises(function () {
            task.setTaskHandler('foo');
        }, "should raise exception on invalid argument");

        strictEqual(task.setTaskHandler(taskHandler), task, "should be chainable");
        strictEqual(task.taskHandler, taskHandler, "should set taskHandler property");
    });

    test("Adding to collection", function () {
        expect(5);

        var task = 'foo'.toGruntTask(),
            collection = g$.GruntTaskCollection.create();

        raises(function () {
            task.addToCollection();
        }, "should raise exception on missing argument");

        raises(function () {
            task.addToCollection('foo');
        }, "should raise exception on invalid collection argument");

        collection.addMocks({
            setItem: function (itemName, itemValue) {
                strictEqual(itemValue, task, "should set task as item in collection");
                equal(itemName, 'foo', "should set task by task name in collection");
            }
        });

        strictEqual(task.addToCollection(collection), task, "should be chainable");
    });
}());
