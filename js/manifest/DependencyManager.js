/*global dessert, troop, sntls, bookworm, grocer */
troop.postpone(grocer, 'DependencyManager', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

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
        .addConstants(/** @lends grocer.DependencyManager# */{
            /** @constant */
            MODULE_NAME_SEPARATOR: '-'
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
            },

            /** @private */
            _getCombinedModuleName: function () {
                var StringUtils = bookworm.StringUtils,
                    MODULE_NAME_SEPARATOR = this.MODULE_NAME_SEPARATOR;

                return slice.call(arguments).toCollection()
                    .passEachItemTo(StringUtils.escapeChars, StringUtils, 0, MODULE_NAME_SEPARATOR)
                    .getValues()
                    .join(MODULE_NAME_SEPARATOR);
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
                        this._getCombinedModuleName(moduleName) :
                        this._getCombinedModuleName(firstAbsentParent, moduleName);

                    return assetName.toAsset(assetType);
                } else {
                    return undefined;
                }
            },

            /**
             * Retrieves a collection of module name groups, indexed by their combined names.
             * Use this when generating (concatenating, minifying, packaging) assets.
             * @returns {sntls.Collection}
             */
            getCombinedModuleNames: function () {
                var that = this;

                return this.dependencyTree
                    // querying all end-to-end dependency paths
                    .queryPathsAsHash('\\>"'.toQuery())
                    .toCollection()
                    .collectProperty('asArray')
                    .createWithEachItem(grocer.DependencyPath)
                    .toCollection(grocer.DependencyPathCollection)

                    // obtaining unique path fragments
                    .getPathFragments()

                    // restructuring collection so that keys are combined module names...
                    .mapKeys(function (/**sntls.Path*/path) {
                        var firstKey = path.asArray[0],
                            lastKey = path.getLastKey();

                        return path.asArray.length === 1 ?
                            that._getCombinedModuleName(firstKey) :
                            that._getCombinedModuleName(firstKey, lastKey);
                    })

                    // ...and values are a list of affected module names
                    .mapValues(function (path) {
                        return path.asArray;
                    });
            }
        });
});
