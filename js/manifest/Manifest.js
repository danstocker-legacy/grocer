/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Manifest', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name grocer.Manifest.create
     * @function
     * @param {object} manifestNode
     * @returns {grocer.Manifest}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.Manifest = self
        .addMethods(/** @lends grocer.Manifest# */{
            /**
             * @param {object} manifestNode
             * @ignore
             */
            init: function (manifestNode) {
                dessert.isObject(manifestNode, "Invalid manifest node");

                /** @type {sntls.Collection} */
                this.modules = sntls.Collection.create(manifestNode)
                    .mapValues(function (moduleNode, moduleName) {
                        return grocer.Module.create(moduleName, moduleNode);
                    });
            },

            /**
             * @param {string} moduleName
             * @returns {grocer.Module}
             */
            getModule: function (moduleName) {
                dessert.isString(moduleName, "Invalid module name");
                return this.modules.getItem(moduleName);
            },

            /**
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            getModulesAsAssets: function (assetType) {
                return this.modules
                    .callOnEachItem('toAsset', assetType)
                    .getValuesAsHash()
                    .toAssetCollection();
            },

            /**
             * @param {string} moduleName
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            getAssetsForModule: function (moduleName, assetType) {
                var module = this.getModule(moduleName);
                return module ?
                    module.getAssets(assetType) :
                    undefined;
            },

            /**
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            getAssets: function (assetType) {
                var result = [];

                this.modules
                    .callOnEachItem('getAssets', assetType)
                    .forEachItem(function (assetCollection) {
                        if (assetCollection) {
                            result = result.concat(assetCollection.items);
                        }
                    });

                return result.toHash().toAssetCollection();
            },

            /** @returns {grocer.Manifest} */
            filterByModuleNames: function () {
                var filteredModules = this.modules
                    .filterByKeys(slice.apply(arguments));

                return this.getBase().create(filteredModules.items);
            }
        });
});
