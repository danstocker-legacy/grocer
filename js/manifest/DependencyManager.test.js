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
        var dependencyManager = grocer.DependencyManager.create();

        deepEqual(dependencyManager.dependencyTree.items, {
            "framework": {
                "user-common": {
                    "user-profile": true,
                    "user-home"   : true
                }
            }
        }, "should initialize dependency tree");
    });

    test("Dependency path getter", function () {
        var dependencyManager = grocer.DependencyManager.create();

        equal(typeof dependencyManager.getDependencyPathForModule('foo'), 'undefined',
            "should return undefined for non-existing module");
        ok(dependencyManager.getDependencyPathForModule('user-profile')
            .equals('framework>user-common>user-profile'.toPath()),
            "should return path from module to root");
    });

    test("Closest non-loaded module getter", function () {
        var dependencyManager = grocer.DependencyManager.create();

        equal(typeof dependencyManager.getFirstAbsentParent('foo'), 'undefined',
            "should return undefined for invalid / absent module");

        bookworm.entities
            .setNode('document>module'.toPath(), {
            });

        equal(dependencyManager.getFirstAbsentParent('user-home'), 'framework',
            "should return root module when no modules are marked as loaded");

        bookworm.entities
            .setNode('document>module'.toPath(), {
                'framework': {
                    loaded: true
                },

                'user-common': {
                    loaded: true
                },

                'user-profile': {
                    loaded: true
                }
            });

        equal(dependencyManager.getFirstAbsentParent('user-home'), 'user-home',
            "should return first non-loaded module name");
    });
}());
