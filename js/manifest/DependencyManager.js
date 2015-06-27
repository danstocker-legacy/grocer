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
             * @param {string} moduleName
             * @returns {sntls.Path}
             */
            getDependencyPathForModule: function (moduleName) {
                return this.dependencyTree
                    .queryPathsAsHash(['\\'.toKVP(), moduleName].toQuery())
                    .getFirstValue();
            },

            /**
             * Retrieves the first module's name on the specified module's parent chain
             * that is not yet loaded.
             * @param {string} moduleName
             * @returns {string}
             */
            getFirstAbsentParentName: function (moduleName) {
                dessert.isString(moduleName, "Invalid module name");

                var dependencyPath = this.getDependencyPathForModule(moduleName),
                    moduleLoadedLookup,
                    i, result;

                if (dependencyPath) {
                    // collecting loaded flags for each module on path
                    moduleLoadedLookup = dependencyPath.asArray.toCollection()
                        .mapKeys(function (moduleName) {
                            return moduleName;
                        })
                        .callOnEachItem('toModule')
                        .callOnEachItem('isLoaded');

                    // finding first non-loaded module
                    for (i = 0; i < dependencyPath.asArray.length; i++) {
                        result = dependencyPath.asArray[i];
                        if (!moduleLoadedLookup.getItem(result)) {
                            break;
                        }
                    }
                }

                return result;
            },

            /**
             * Retrieves an Asset instance for the specified module and asset type.
             * The returned asset will contain the specified module's parents
             * up to the first module that is already loaded.
             * @param {string} moduleName
             * @param {string} assetType
             * @returns {grocer.Asset}
             */
            getAssetForModule: function (moduleName, assetType) {
                var firstAbsentParent = this.getFirstAbsentParentName(moduleName),
                    assetName;

                if (typeof firstAbsentParent !== 'undefined') {
                    assetName = firstAbsentParent === moduleName ?
                        bookworm.StringUtils.escapeChars(moduleName, '-') : [
                        bookworm.StringUtils.escapeChars(firstAbsentParent, '-'),
                        bookworm.StringUtils.escapeChars(moduleName, '-')
                    ].join('-');

                    return assetName.toAsset(assetType);
                } else {
                    return undefined;
                }
            }
        });
});
