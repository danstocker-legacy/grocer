/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("MultiTask");

    test("Instantiation with object", function () {
        raises(function () {
            g$.MultiTask.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var configNode = {
                dev : {},
                prod: {}
            },
            task;

        task = g$.MultiTask.create('foo');
        deepEqual(task.configNode, {}, "should set configNode property to empty object");

        task = g$.MultiTask.create('foo', configNode);
        strictEqual(task.configNode, configNode, "should set configNode property to specified object");
    });

    test("Instantiation with function", function () {
        var task = g$.MultiTask.create('foo', genConfigNode);

        function genConfigNode() {
        }

        strictEqual(task.configNode, genConfigNode, "should set configNode property to specified function");
    });

    test("Conversion from string", function () {
        var multiTask = 'foo'.toMultiTask({
            foo: {}
        });

        ok(multiTask.hasOwnProperty('gruntPlugin'), "should add gruntPlugin property");
        equal(typeof multiTask.gruntPlugin, 'undefined', "should initialize gruntPlugin property to undefined");

        ok(multiTask.isA(g$.MultiTask), "should return MultiTask instance");
        equal(multiTask.taskName, 'foo', "should set task name");
        deepEqual(multiTask.configNode, {
            foo: {}
        }, "should set configNode property to specified object");

    });

    test("Setting task path", function () {
        var task = 'foo'.toMultiTask();

        strictEqual(task.setTaskPath('foo/bar/baz'), task, "should be chainable");
        equal(task.taskPath, 'foo/bar/baz', "should set taskPath property");
    });

    test("Setting package name", function () {
        var task = 'foo'.toMultiTask();

        strictEqual(task.setPackageName('grunt-foo'), task, "should be chainable");
        ok(task.gruntPlugin.isA(g$.GruntPlugin), "should set a GruntPlugin instance");
        equal(task.gruntPlugin.packageName, 'grunt-foo', "should set package name for plugin");
    });

    test("Applying plugin-based task", function () {
        expect(2);

        var task = 'foo'.toMultiTask()
            .setPackageName('grunt-foo');

        g$.GruntProxy.addMocks({
            loadNpmTasks: function (taskName) {
                equal(taskName, 'grunt-foo', "should load plugin");
            }
        });

        strictEqual(task.applyTask(), task, "should be chainable");

        g$.GruntProxy.removeMocks();
    });

    test("Applying path-based task", function () {
        expect(2);

        var task = 'foo'.toMultiTask()
            .setTaskPath('foo/bar/baz');

        g$.GruntProxy.addMocks({
            loadTasks: function (taskPath) {
                equal(taskPath, 'foo/bar/baz', "should load task from path");
            }
        });

        strictEqual(task.applyTask('foo/bar/baz'), task, "should be chainable");

        g$.GruntProxy.removeMocks();
    });

    test("Applying handler-based task", function () {
        expect(4);

        var task = 'foo'.toMultiTask()
            .setTaskHandler(function () {
            });

        g$.GruntProxy.addMocks({
            registerMultiTask: function (taskName, description, handler) {
                equal(taskName, 'foo', "should register multi task");
                equal(description, 'bar', "should pass description to registration");
                strictEqual(handler, task.taskHandler, "should pass task handler to registration");
            }
        });

        strictEqual(task.applyTask('bar'), task, "should be chainable");

        g$.GruntProxy.removeMocks();
    });

    test("Config node getter with object", function () {
        var task = 'foo'.toMultiTask({
            foo: {
                bar: 'baz'
            }
        });

        raises(function () {
            task.getConfigNode(4);
        }, "should raise exception on invalid argument");

        strictEqual(task.getConfigNode(), task.configNode,
            "should return configNode when no target prefix is specified");

        deepEqual(task.getConfigNode('_'), {
            _foo: {
                bar: 'baz'
            }
        }, "should return task config node with prefixed targets when prefix is specified");
    });

    test("Config node getter with generator", function () {
        var task = 'foo'.toMultiTask(function () {
            return {
                foo: {
                    bar: 'baz'
                }
            };
        });

        deepEqual(task.getConfigNode(), {
                foo: {
                    bar: 'baz'
                }
            },
            "should return configNode copy when no target prefix is specified");

        deepEqual(task.getConfigNode('_'), {
            _foo: {
                bar: 'baz'
            }
        }, "should return task config node with prefixed targets when prefix is specified");
    });

    test("Addition to config", function () {
        expect(4);

        var task = 'foo'.toMultiTask({
                foo: {
                    bar: 'baz'
                }
            }),
            config = g$.GruntConfig.create();

        raises(function () {
            task.addToConfig();
        }, "should raise exception on missing argument");

        raises(function () {
            task.addToConfig('foo');
        }, "should raise exception on invalid argument");

        config.addMocks({
            addMultiTask: function (multiTask) {
                strictEqual(multiTask, task, "should add task to config using config API");
            }
        });

        strictEqual(task.addToConfig(config), task, "should be chainable");
    });

    test("Adding to collection", function () {
        expect(5);

        var task = 'foo'.toMultiTask(),
            collection = g$.MultiTaskCollection.create();

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
