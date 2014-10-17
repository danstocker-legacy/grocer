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

        raises(function () {
            task.getConfigNode(4);
        }, "should raise exception on invalid argument");

        strictEqual(task.getConfigNode(), task.targets.items,
            "should return targets buffer when no target prefix is specified");

        deepEqual(task.getConfigNode('_'), {
            _foo: {
                bar: 'baz'
            }
        }, "should return task config node with prefixed targets when prefix is specified");
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

    test("Adding to collection", function () {
        expect(6);

        var task = 'grunt-foo'.toPluginTask(),
            collection = g$.PluginTaskCollection.create();

        raises(function () {
            task.addToCollection();
        }, "should raise exception on missing arguments");

        raises(function () {
            task.addToCollection('foo');
        }, "should raise exception on invalid collection argument");

        raises(function () {
            task.addToCollection(collection, 1);
        }, "should raise exception on invalid task name argument");

        collection.addMocks({
            setItem: function (itemName, itemValue) {
                strictEqual(itemValue, task, "should set task as item in collection");
                equal(itemName, 'foo', "should set task by specified name in collection");
            }
        });

        strictEqual(task.addToCollection(collection, 'foo'), task, "should be chainable");
    });
}());
