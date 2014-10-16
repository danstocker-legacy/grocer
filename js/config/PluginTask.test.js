/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PluginTask");

    test("Instantiation", function () {
        raises(function () {
            g$.PluginTask.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var taskNode = {
                dev : {},
                prod: {}
            },
            task = g$.PluginTask.create('foo', taskNode);

        ok(task.targets.isA(sntls.Collection), "should initialize targets property as collection");
        strictEqual(task.targets.items, taskNode, "should set targets' buffer to specified taskNode");
    });

    test("Conversion from string", function () {
        var pluginTask = 'foo'.toPluginTask();

        ok(pluginTask.isA(g$.PluginTask), "should return PluginTask instance");
        equal(pluginTask.taskName, 'foo', "should set task (plugin) name");
    });

    test("Target addition", function () {
        var task = 'foo'.toPluginTask();

        strictEqual(task.addTarget('bar', {hello: "world"}), task, "should be chainable");

        deepEqual(task.targets.items, {
            bar: {
                hello: "world"
            }
        });
    });

    test("Target tester", function () {
        var task = g$.PluginTask.create('foo', {
            foo: {}
        });

        ok(task.hasTarget('foo'), "should return true for existing target");
        ok(!task.hasTarget('bar'), "should return false for missing target");
    });
}());
