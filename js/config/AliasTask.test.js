/*global dessert, troop, sntls, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("AliasTask", {
        setup: function () {
            grocer.AliasTask.clearInstanceRegistry();
        },
        teardown: function () {
            grocer.AliasTask.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var task = grocer.AliasTask.create('foo');

        ok(task.subTasks.isA(sntls.Collection), "should initialize subTasks property as Collection");
        equal(task.subTasks.getKeyCount(), 0, "should set subTasks to empty collection");

        strictEqual(grocer.AliasTask.create('foo'), task, "should be memoized");
    });

    test("Conversion from string", function () {
        var task = 'foo'.toAliasTask();

        ok(task.isA(grocer.AliasTask), "should return AliasTask instance");
        equal(task.taskName, 'foo', "should set task name");
    });

    test("Task registration", function () {
        expect(4);

        var task = grocer.AliasTask.create('foo')
            .addSubTasks('hello', 'world');

        grocer.GruntProxy.addMocks({
            registerTask: function (name, description, taskList) {
                equal(name, 'foo', "should specify task name");
                equal(description, 'bar', "should pass description");
                deepEqual(taskList, ['hello', 'world'], "should pass task names");
            }
        });

        strictEqual(task.applyTask('bar'), task, "should be chainable");

        grocer.GruntProxy.removeMocks();
    });

    test("Sub-task addition", function () {
        var task = grocer.AliasTask.create('foo');

        strictEqual(task.addSubTask('foo'), task, "should be chainable");
        deepEqual(task.subTasks.items, {
            foo: 'foo'
        }, "should set task name as collection item");
    });

    test("Multiple sub-task addition", function () {
        var task = grocer.AliasTask.create('foo');

        strictEqual(task.addSubTasks('foo', 'bar', 'baz'), task, "should be chainable");
        deepEqual(task.subTasks.items, {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        }, "should set task names as collection item");
    });
}());
