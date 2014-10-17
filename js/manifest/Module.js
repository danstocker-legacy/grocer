/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Module', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.Module.create
     * @function
     * @param {string} moduleName
     * @param {object} moduleNode
     * @returns {grocer.Module}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.Module = self
        .addMethods(/** @lends grocer.Module# */{
            /**
             * @param {string} moduleName
             * @param {object} moduleNode
             * @ignore
             */
            init: function (moduleName, moduleNode) {
                dessert
                    .isString(moduleName, "Invalid module name")
                    .isObject(moduleNode, "Invalid module node");

                /** @type {sntls.Tree} moduleNode */
                var moduleDescriptor = sntls.Tree.create(moduleNode),
                    classPath = moduleDescriptor.getNode('classPath'.toPath());

                /** @type {string} */
                this.moduleName = moduleName;

                /** @type {sntls.Path} */
                this.classPath = classPath ?
                    classPath.toPathFromClassPath() :
                    undefined;

                /** @type {sntls.Collection} */
                this.assetsCollection = moduleDescriptor
                    .getNodeAsHash('assets'.toPath())
                    .toCollection()
                    .mapValues(function (assetList, assetType) {
                        return assetList.toAssetCollection(assetType);
                    });
            },

            /**
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            getAssets: function (assetType) {
                dessert.isString(assetType, "Invalid asset type");
                return this.assetsCollection.getItem(assetType);
            },

            /**
             * @param {string} assetType
             * @returns {string[]}
             */
            getAssetList: function (assetType) {
                dessert.isString(assetType, "Invalid asset type");
                var assets = this.assetsCollection.getItem(assetType);
                return assets ?
                    assets.getAssetList() :
                    [];
            },

            /**
             * @param {string} assetType
             * @returns {grocer.Asset}
             */
            toAsset: function (assetType) {
                dessert
                    .isString(assetType, "Invalid asset type")
                    .assert(this.assetsCollection.getItem(assetType), "Invalid assetType");
                return (this.moduleName + '.' + assetType).toAsset(assetType);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @param {object} [moduleNode]
             * @returns {grocer.Module}
             */
            toModule: function (moduleNode) {
                return grocer.Module.create(this.valueOf(), moduleNode);
            }
        },
        false, false, false
    );
}());
