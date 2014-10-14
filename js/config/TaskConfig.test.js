/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("TaskConfig");

    test("Instantiation", function () {
        raises(function () {
            g$.TaskConfig.create('bar');
        }, "should raise exception on invalid arguments");

        var taskNode = {
                dev : {},
                prod: {}
            },
            task = g$.TaskConfig.create(taskNode);

        ok(task.targets.isA(sntls.Collection), "should initialize targets property as collection");
        strictEqual(task.targets.items, taskNode, "should set targets' buffer to specified taskNode");
    });

    test("Target addition", function () {
        var task = g$.TaskConfig.create();

        strictEqual(task.addTarget('bar', {hello: "world"}), task, "should be chainable");

        deepEqual(task.targets.items, {
            bar: {
                hello: "world"
            }
        });
    });

    test("Task merge", function () {
        var taskA = g$.TaskConfig.create({
                dev : {
                    hello: "world"
                },
                prod: {}
            }),
            taskB = g$.TaskConfig.create({
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

        ok(taskMerged.isA(g$.TaskConfig), "should return TaskConfig instance");
        deepEqual(taskMerged.targets.items, {
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
