/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntConfig");

    test("Instantiation", function () {
        raises(function () {
            g$.GruntConfig.create('foo');
        }, "should raise exception on invalid arguments");

        var configNode = {
                copy  : {},
                cssMin: {}
            },
            addedTasks = [];

        g$.GruntConfig.addMocks({
            addTask: function (taskName, task) {
                addedTasks.push([taskName, task]);
            }
        });

        var config = g$.GruntConfig.create(configNode);

        g$.GruntConfig.removeMocks();

        ok(config.taskConfigs.isA(sntls.Collection), "should initialize tasks property as collection");

        deepEqual(addedTasks, [
            ['copy', g$.TaskConfig.create({})],
            ['cssMin', g$.TaskConfig.create({})]
        ], "should add Task instances based on parsed config node");
    });

    test("Config initialization", function () {
        expect(3);

        var config = g$.GruntConfig.create(),
            configNode = {};

        config.addMocks({
            getConfigNode: function () {
                ok(true, "should fetch config node");
                return configNode;
            }
        });

        g$.GruntProxy.addMocks({
            initConfig: function (config) {
                strictEqual(config, configNode, "should pass config node to grunt.initConfig()");
            }
        });

        strictEqual(config.initConfig(), config, "should be chainable");

        g$.GruntProxy.removeMocks();
    });

    test("Task addition", function () {
        expect(4);

        var config = g$.GruntConfig.create(),
            cssTask = g$.TaskConfig.create({});

        raises(function () {
            config.addTask('foo', 'bar');
        }, "should raise exception on invalid argument");

        config.taskConfigs.addMocks({
            setItem: function (taskName, task) {
                equal(taskName, 'cssMin', "should specify task name as item key in tasks collection");
                strictEqual(task, cssTask, "should set task in tasks collection");
            }
        });

        strictEqual(config.addTask('cssMin', cssTask), config, "should be chainable");
    });

    test("Config node getter", function () {
        var config = g$.GruntConfig.create()
            .addTask('copy', g$.TaskConfig.create({
                dev : {},
                prod: {}
            }))
            .addTask('cssMin', g$.TaskConfig.create({
                dev : {},
                prod: {}
            }));

        deepEqual(config.getConfigNode(), {
            copy  : {
                dev : {},
                prod: {}
            },
            cssMin: {
                dev : {},
                prod: {}
            }
        }, "should return config node");
    });

    test("Getting tasks with specified target", function () {
        var config = g$.GruntConfig.create()
                .addTask('copy', g$.TaskConfig.create({
                    dev : {},
                    prod: {}
                }))
                .addTask('cssMin', g$.TaskConfig.create({
                    dev: {}
                })),
            result;

        result = config.getTasksWithTarget('dev');
        ok(result.isA(sntls.Hash), "should return Hash instance");
        deepEqual(result.items, ['copy', 'cssMin'], "should return Hash with correct contents");

        result = config.getTasksWithTarget('prod');
        deepEqual(result.items, ['copy'], "should return Hash with correct contents");
    });

    test("Config merge", function () {
        var configA = g$.GruntConfig.create({
                copy  : {
                    dev : {},
                    prod: {}
                },
                cssMin: {
                    dev : {},
                    prod: {}
                }
            }),
            configB = g$.GruntConfig.create({
                copy : {
                    dev : {},
                    prod: {}
                },
                jsMin: {
                    dev : {},
                    prod: {}
                }
            }),
            configMerged,
            addedTasks = [];

        raises(function () {
            configA.mergeWith();
        }, "should raise exception on missing argument");

        raises(function () {
            configA.mergeWith('foo');
        }, "should raise exception on invalid remoteConfig argument");

        g$.GruntConfig.addMocks({
            addTask: function (taskName, task) {
                addedTasks.push([taskName, task.targets.items]);
            }
        });

        configMerged = configA.mergeWith(configB, 'foo-');

        g$.GruntConfig.removeMocks();

        ok(configMerged.isA(g$.GruntConfig), "should return GruntConfig instance");

        deepEqual(addedTasks, [
            [
                'copy',
                {
                    "dev"     : {},
                    "prod"    : {},
                    "foo-dev" : {},
                    "foo-prod": {}
                }
            ],
            [
                'cssMin',
                {
                    "dev" : {},
                    "prod": {}
                }
            ],
            [
                'jsMin',
                {
                    "foo-dev" : {},
                    "foo-prod": {}
                }
            ]
        ],
            "should merge remote config with prefixed targets");
    });
}());
