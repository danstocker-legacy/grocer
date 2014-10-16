/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntConfig");

    test("Config initialization", function () {
        expect(2);

        var config = g$.GruntConfig.create();

        g$.GruntProxy.addMocks({
            initConfig: function (configNode) {
                strictEqual(configNode, config.items, "should pass config node to grunt.initConfig()");
            }
        });

        strictEqual(config.initConfig(), config, "should be chainable");

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
        ok(result.isA(sntls.Collection), "should return Collection instance");
        deepEqual(result.items, {
            dev : 'dev'.toAliasTask().addSubTasks('copy:dev', 'cssMin:dev'),
            prod: 'prod'.toAliasTask().addSubTask('copy:prod')
        }, "should return collection of AliasTask instances");
    });
}());
