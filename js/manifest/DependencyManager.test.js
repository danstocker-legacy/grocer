/*global dessert, troop, sntls, bookworm, grocer */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("DependencyManager", {
        setup: function () {
            grocer.DependencyManager.clearInstanceRegistry();

            bookworm.entities
                .setNode('document>module'.toPath(), {
                    'framework': {
                        assets: {
                            js: [
                                'node_modules/dessert/dessert.js',
                                'node_modules/troop/troop.js',
                                'node_modules/q/q.js',
                                'node_modules/sntls/sntls.js',
                                'node_modules/evan/evan.js',
                                'node_modules/rubberband/rubberband.js',
                                'node_modules/bookworm/bookworm.js'
                            ]
                        }
                    },

                    'user-common': {
                        parent: 'framework',
                        assets: {
                            js: [
                                'src/model/UserDocument.js'
                            ]
                        }
                    },

                    'user-profile': {
                        parent: 'user-common',
                        assets: {
                            js: [
                                'src/widgets/UserProfilePage.js'
                            ]
                        }
                    },

                    'user-home': {
                        parent: 'user-common',
                        assets: {
                            js: [
                                'src/widgets/UserHomePage.js'
                            ]
                        }
                    }
                });
        },

        teardown: function () {
            grocer.DependencyManager.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var dependencyTree = grocer.DependencyManager.create();

        deepEqual(dependencyTree.dependencyTree.items, {
            "framework": {
                "user-common": {
                    "user-profile": true,
                    "user-home"   : true
                }
            }
        }, "should initialize dependency tree");
    });
}());
