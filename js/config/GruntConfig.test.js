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

        ok(config.tasks.isA(sntls.Collection), "should initialize tasks property as collection");

        deepEqual(addedTasks, [
            ['copy', g$.GruntTask.create({})],
            ['cssMin', g$.GruntTask.create({})]
        ], "should add Task instances based on parsed config node");
    });

    test("Task addition", function () {
        expect(4);

        var config = g$.GruntConfig.create(),
            cssTask = g$.GruntTask.create({});

        raises(function () {
            config.addTask('foo', 'bar');
        }, "should raise exception on invalid argument");

        config.tasks.addMocks({
            setItem: function (taskName, task) {
                equal(taskName, 'cssMin', "should specify task name as item key in tasks collection");
                strictEqual(task, cssTask, "should set task in tasks collection");
            }
        });

        strictEqual(config.addTask('cssMin', cssTask), config, "should be chainable");
    });

    test("Config node getter", function () {
        var config = g$.GruntConfig.create()
            .addTask('copy', g$.GruntTask.create({
                dev : {},
                prod: {}
            }))
            .addTask('cssMin', g$.GruntTask.create({
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
                addedTasks.push([taskName, task.subTasks.items]);
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
            "should merge remote config with prefixed sub-tasks");
    });
}());
