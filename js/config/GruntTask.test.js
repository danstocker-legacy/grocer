/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntTask");

    test("Instantiation", function () {
        raises(function () {
            g$.GruntTask.create();
        }, "should raise exception on missing arguments");

        raises(function () {
            g$.GruntTask.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var taskNode = {
                dev : {},
                prod: {}
            },
            task = g$.GruntTask.create('foo', taskNode);

        equal(task.taskName, 'foo', "should set task name");
        ok(task.subTasks.isA(sntls.Collection), "should initialize subTasks property as collection");
        strictEqual(task.subTasks.items, taskNode, "should set subTasks' buffer to specified taskNode");
    });

    test("Sub-task addition", function () {
        var task = g$.GruntTask.create('foo');

        strictEqual(task.addSubTask('bar', {hello: "world"}), task, "should be chainable");

        deepEqual(task.subTasks.items, {
            bar: {
                hello: "world"
            }
        });
    });

    test("Task merge", function () {
        var taskA = g$.GruntTask.create('copy', {
                dev : {
                    hello: "world"
                },
                prod: {}
            }),
            taskB = g$.GruntTask.create('cssMin', {
                dev : {
                    hi: "all"
                },
                prod: {}
            }),
            taskMerged;

        raises(function () {
            taskA.mergeWith();
        }, "should raise exception on missing argument");

        raises(function () {
            taskA.mergeWith('foo');
        }, "should raise exception on invalid remoteTask argument");

        raises(function () {
            taskA.mergeWith(taskB, 2345);
        }, "should raise exception on invalid prefix argument");

        taskMerged = taskA.mergeWith(taskB, 'foo-');

        ok(taskMerged.isA(g$.GruntTask), "should return GruntTask instance");
        deepEqual(taskMerged.subTasks.items, {
            'dev'     : {
                hello: "world"
            },
            'prod'    : {},
            'foo-dev' : {
                hi: "all"
            },
            'foo-prod': {}
        });
    });
}());
