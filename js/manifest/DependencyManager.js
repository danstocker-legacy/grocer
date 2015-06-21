/*global dessert, troop, sntls, bookworm, grocer */
troop.postpone(grocer, 'DependencyManager', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.DependencyManager.create
     * @function
     * @returns {grocer.DependencyManager}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.DependencyManager = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addPrivateMethods(/** @lends grocer.DependencyManager# */{
            /** @private */
            _populateDependencyTree: function () {
                var dependencyQuery = 'document>module>|>parent'.toQuery(),
                    dependencyTree = this.dependencyTree;

                bookworm.entities.queryPathValuePairsAsHash(dependencyQuery)
                    .toCollection()

                    // indexing parents by moduleName
                    .mapKeys(function (moduleNames, pathStr) {
                        return pathStr.toPath().asArray[2];
                    })

                    // constructing up-down dependency tree
                    .mapValues(function (parent) {
                        var result = {};
                        result[parent] = parent;
                        return result;
                    })
                    .forEachItem(function (dependencies) {
                        var moduleNames = Object.keys(dependencies),
                            i, moduleName;

                        for (i = 0; i < moduleNames.length; i++) {
                            moduleName = moduleNames[i];
                            dependencies[moduleName] = this.getItem(moduleName);
                        }
                    })

                    // flipping dependency tree to bottom-up
                    .toTree()
                    .queryPathsAsHash('\\>"'.toQuery())
                    .toCollection()
                    .forEachItem(function (path) {
                        path.asArray.reverse();
                    })
                    .forEachItem(function (path) {
                        var node = dependencyTree.getNode(path);
                        if (!node) {
                            // making sure we don't overwrite an existing node
                            dependencyTree.setNode(path, true);
                        }
                    });
            }
        })
        .addMethods(/** @lends grocer.DependencyManager# */{
            /**
             * @ignore
             */
            init: function () {
                /**
                 * Tree that contains the bottom-up dependency definitions for the entire application.
                 * @type {sntls.Tree}
                 */
                this.dependencyTree = sntls.Tree.create();

                this._populateDependencyTree();
            },

            /**
             * Retrieves the last loaded module on the specified module's parent chain.
             * @param {string} moduleName
             * @returns {string}
             */
            getClosestLoadedParent: function (moduleName) {

            }
        });
});
