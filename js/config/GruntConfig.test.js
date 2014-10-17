/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntConfig");

    test("Task addition", function () {
        var config = g$.GruntConfig.create(),
            task = 'foo'.toPluginTask({
                hello: "world"
            }),
            taskConfigNode = {};

        raises(function () {
            config.addTask();
        }, "should raise exception on missing arguments");

        raises(function () {
            config.addTask('foo');
        }, "should raise exception on invalid arguments");

        task.addMocks({
            getConfigNode: function () {
                return taskConfigNode;
            }
        });

        strictEqual(config.addTask('bar', task), config, "should be chainable");

        deepEqual(config.items, {
            'bar': taskConfigNode
        }, "should set task config node in config");
    });

    test("Task config getter", function () {
        var config = g$.GruntConfig.create({
            hello: "world"
        });

        equal(config.getTask('hello'), "world", "should return task config node");
    });

    test("Config initialization", function () {
        expect(3);

        var config = g$.GruntConfig.create();

        g$.GruntProxy.addMocks({
            configMerge: function (configNode) {
                strictEqual(configNode, config.items, "should pass config node to grunt.config.merge()");
            }
        });

        strictEqual(config.applyConfig(), config, "should be chainable");

        g$.GruntProxy.removeMocks();

        g$.GruntProxy.addMocks({
            configInit: function (configNode) {
                strictEqual(configNode, config.items,
                    "should pass config node to grunt.config.init() when wipe argument is set");
            }
        });

        config.applyConfig(true);

        g$.GruntProxy.removeMocks();
    });

    test("Getting tasks grouped by target", function () {
        var config = g$.GruntConfig.create({
                copy  : {
                    dev : {},
                    prod: {}
                },
                cssMin: {
                    dev: {}
                }
            }),
            result;

        result = config.getTasksGroupedByTarget('dev');
        ok(result.isA(sntls.Hash), "should return Hash instance");
        deepEqual(result.items, {dev: ['copy:dev', 'cssMin:dev']}, "should return Hash with correct contents");

        result = config.getTasksGroupedByTarget('prod');
        deepEqual(result.items, {prod: 'copy:prod'}, "should return Hash with correct contents");

        result = config.getTasksGroupedByTarget();
        deepEqual(result.items, {
            dev : ['copy:dev', 'cssMin:dev'],
            prod: 'copy:prod'
        }, "should return Hash with correct contents");
    });

    test("Getting alias tasks grouped by target", function () {
        var config = g$.GruntConfig.create({
                copy  : {
                    dev : {},
                    prod: {}
                },
                cssMin: {
                    dev: {}
                }
            }),
            result;

        result = config.getAliasTasksGroupedByTarget();
        ok(result.isA(g$.GruntTaskCollection), "should return GruntTaskCollection instance");
        deepEqual(result.items, {
            dev : 'dev'.toAliasTask().addSubTasks('copy:dev', 'cssMin:dev'),
            prod: 'prod'.toAliasTask().addSubTask('copy:prod')
        }, "should return collection of AliasTask instances");
    });

    test("Config merge", function () {
        var tasks = g$.PluginTaskCollection.create(),
            configA = g$.GruntConfig.create({
                copy  : {
                    dev : {foo: "baz"},
                    prod: {hello: "all"}
                },
                cssMin: {
                    dev: {}
                }
            }),
            configMerged;

        'grunt-copy'.toPluginTask({
            dev : {foo: "bar"},
            prod: {hello: "world"}
        }).addToCollection(tasks, 'copy');

        'grunt-css-min'.toPluginTask({
            dev : {foo: "baz"},
            prod: {hello: "all"}
        }).addToCollection(tasks, 'cssMin');

        configMerged = configA.mergeWith(tasks.toGruntConfig('_'));

        ok(configMerged.isA(g$.GruntConfig), "should return GruntConfig instance");
        deepEqual(configMerged.items, {
            copy  : {
                dev  : {foo: "baz"},
                prod : {hello: "all"},
                _dev : {foo: "bar"},
                _prod: {hello: "world"}
            },
            cssMin: {
                dev  : {},
                _dev : {foo: "baz"},
                _prod: {hello: "all"}
            }
        }, "should return merged config");
    });
}());
