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
        equal(pluginTask.targets.getKeyCount(), 0, "should set targets property to empty collection");

        pluginTask = 'foo'.toPluginTask({
            foo: {}
        });

        deepEqual(pluginTask.targets.items, {
            foo: {}
        }, "should set targets property to collection having the specified config node");
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

    test("Config node getter", function () {
        var task = 'foo'.toPluginTask()
            .addTarget('foo', {
                bar: 'baz'
            });

        strictEqual(task.getConfigNode(), task.targets.items, "should return targets buffer");
    });

    test("Addition to config", function () {
        expect(5);

        var task = 'foo'.toPluginTask()
            .addTarget('foo', {
                bar: 'baz'
            }),
            config = g$.GruntConfig.create();

        raises(function () {
            task.addToConfig();
        }, "should raise exception on missing arguments");

        raises(function () {
            task.addToConfig('foo', 'bar');
        }, "should raise exception on invalid arguments");

        config.addMocks({
            addTask: function (taskName, pluginTask) {
                strictEqual(pluginTask, task, "should add task to config using config API");
                equal(taskName, 'bar', "should pass task name to task adder on config");
            }
        });

        strictEqual(task.addToConfig(config, 'bar'), task, "should be chainable");
    });
}());
