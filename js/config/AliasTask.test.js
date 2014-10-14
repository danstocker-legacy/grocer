/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("AliasTask");

    test("Instantiation", function () {
        var task = g$.AliasTask.create('foo');

        ok(task.subTasks.isA(sntls.Collection), "should initialize subTasks property as Collection");
        equal(task.subTasks.getKeyCount(), 0, "should set subTasks to empty collection");
    });

    test("Conversion from string", function () {
        var task = 'foo'.toAliasTask();

        ok(task.isA(g$.AliasTask), "should return AliasTask instance");
        equal(task.taskName, 'foo', "should set task name");
    });

    test("Sub-task addition", function () {
        var task = g$.AliasTask.create('foo');

        strictEqual(task.addSubTask('foo'), task, "should be chainable");
        deepEqual(task.subTasks.items, {
            foo: 'foo'
        }, "should set task name as collection item");
    });

    test("Multiple sub-task addition", function () {
        var task = g$.AliasTask.create('foo');

        strictEqual(task.addSubTasks('foo', 'bar', 'baz'), task, "should be chainable");
        deepEqual(task.subTasks.items, {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        }, "should set task names as collection item");
    });

    test("Task registration", function () {
        expect(4);

        var task = g$.AliasTask.create('foo')
            .addSubTasks('hello', 'world');

        g$.GruntProxy.addMocks({
            registerTask: function (name, description, taskList) {
                equal(name, 'foo', "should specify task name");
                equal(description, 'bar', "should pass description");
                deepEqual(taskList, ['hello', 'world'], "should pass task names");
            }
        });

        strictEqual(task.registerTask('bar'), task, "should be chainable");

        g$.GruntProxy.removeMocks();
    });
}());
