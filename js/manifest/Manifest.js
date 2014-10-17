/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Manifest', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

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
             * @returns {grocer.Assets}
             */
            getModulesAsAssets: function (assetType) {
                return this.modules.getKeysAsHash()
                    .toCollection()
                    .mapValues(function (assetId) {
                        return assetId + '.' + assetType;
                    })
                    .toAssets(assetType);
            },

            /** @returns {grocer.Manifest} */
            forEachModule: function () {
                this.modules.forEachItem.apply(this.modules, arguments);
                return this;
            },

            /**
             * @param {string} moduleName
             * @param {string} assetType
             * @returns {string[]}
             */
            getAssetListForModule: function (moduleName, assetType) {
                var module = this.getModule(moduleName);
                return module ?
                    module.getAssetList(assetType) :
                    [];
            },

            /**
             * @param {string} assetType
             * @returns {string[]}
             */
            getAssetList: function (assetType) {
                var result = [];

                this.modules
                    .callOnEachItem('getAssetList', assetType)
                    .forEachItem(function (assetList) {
                        result = result.concat(assetList);
                    });

                return result;
            },

            /**
             * @param {string} assetType
             * @returns {string}
             */
            getSerializedAssetList: function (assetType) {
                var result = [];

                this.modules
                    .callOnEachItem('getAssets', assetType)
                    .forEachItem(function (/**grocer.Assets*/assets) {
                        if (assets) {
                            result.push(assets.toString());
                        }
                    });

                return result.join('\n');
            }
        });
});
