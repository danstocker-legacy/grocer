/*global dessert, troop, sntls, bookworm, grocer */
troop.postpone(grocer, 'Manifest', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a Manifest instance.
     * See the sample manifest file included in the repo. (/manifest/manifest-sample.json)
     * @name grocer.Manifest.create
     * @function
     * @returns {grocer.Manifest}
     */

    /**
     * The Manifest class describes the modularity and assets of an application.
     * Organizes assets (usually JS and CSS files that make up the application) into modules.
     * @class
     * @extends troop.Base
     */
    grocer.Manifest = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends grocer.Manifest# */{
            /** @ignore */
            init: function () {
                /**
                 * Defines and maintains the modules of the application.
                 * Collection holds Module instances.
                 * @type {sntls.Collection}
                 */
                this.modules = bookworm.entities.getNodeAsHash('document>module'.toPath())
                    .getKeysAsHash()
                    .toCollection()
                    .callOnEachItem('toModule');
            },

            /**
             * Retrieves all modules as single assets of the specified asset type.
             * Only those modules will be included in the result that have such assets.
             * Generally used to generate production asset list.
             * @param {string} assetType Type of assets to be retrieved.
             * @returns {grocer.AssetCollection}
             */
            getModulesAsAssetsForType: function (assetType) {
                return this.modules
                    .callOnEachItem('toAsset', assetType)
                    .getValuesAsHash()
                    .toAssetCollection();
            },

            /**
             * Retrieves assets from all modules matching the specified asset type.
             * @param {string} assetType Type of assets to be retrieved.
             * @returns {grocer.AssetCollection}
             */
            getAssetsForType: function (assetType) {
                var result = [];

                this.modules
                    .callOnEachItem('getAssetsForType', assetType)
                    .forEachItem(function (assetCollection) {
                        if (assetCollection) {
                            result = result.concat(assetCollection.items);
                        }
                    });

                return result.toHash().toAssetCollection();
            },

            /**
             * Retrieves assets from all modules matching the specified asset type,
             * with all returned paths flattened out. (So that assets may go in the same folder.)
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            getFlatAssets: function (assetType) {
                return this.getAssetsForType(assetType)
                    .getFlatAssetFileNameLookup()
                    .getValuesAsHash()
                    .toCollection()
                    .callOnEachItem('toAsset', assetType)
                    .toAssetCollection();
            }
        });
});
