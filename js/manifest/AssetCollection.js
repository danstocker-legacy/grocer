/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'AssetCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.Asset),
        self = base.extend();

    /**
     * @name grocer.AssetCollection.create
     * @function
     * @param {Asset[]} [items]
     * @returns {grocer.AssetCollection}
     */

    /**
     * The AssetCollection offers an API to perform uniform operations on a set of Asset instances.
     * @class
     * @extends troop.Base
     */
    grocer.AssetCollection = self
        .addMethods(/** @lends grocer.AssetCollection# */{
            /**
             * @param {Asset[]} [items]
             * @ignore
             */
            init: function (items) {
                dessert.isArray(items, "Invalid asset list");
                base.init.call(this, items);
            },

            /**
             * Retrieves an array of asset paths based on the assets in the collection.
             * @returns {string[]}
             */
            getAssetNames: function () {
                return this
                    .mapValues(function (/**grocer.Asset*/asset) {
                        return asset.assetPath;
                    })
                    .items;
            },

            /**
             * Retrieves a dictionary of asset paths associated with flattened asset file names.
             * @returns {sntls.Dictionary}
             */
            getFlatAssetFileNameLookup: function () {
                var result = {},

                // assets identified by their (unique) asset paths
                    assetPathByAsset = this
                        .mapKeys(function (/**grocer.Asset*/asset) {
                            return asset.assetPath;
                        }),

                // asset path lookup by asset file names (with extension)
                    assetFileNameToAssetPath = assetPathByAsset
                        .mapValues(function (/**grocer.Asset*/asset) {
                            return asset.getAssetFileName();
                        })
                        .toStringDictionary()
                        .reverse(),

                // asset data lookup by (unique) asset paths
                    assetPathToAssetNameParts = assetPathByAsset
                        .mapValues(function (/**grocer.Asset*/asset, assetPath) {
                            return {
                                name: assetPath,
                                base: asset.getAssetBaseName(),
                                ext : asset.getAssetExtension()
                            };
                        })
                        .toDictionary();

                // obtaining flat asset file names associated with asset path
                assetFileNameToAssetPath
                    .combineWith(assetPathToAssetNameParts)
                    .toCollection()
                    .forEachItem(function (assetData) {
                        var i, assetParts;
                        if (assetData instanceof Array) {
                            for (i = 0; i < assetData.length; i++) {
                                assetParts = assetData[i];
                                result[assetParts.name] = assetParts.base + i + '.' + assetParts.ext;
                            }
                        } else {
                            assetParts = assetData;
                            result[assetParts.name] = assetParts.base + '.' + assetParts.ext;
                        }
                    });

                return sntls.Dictionary.create(result);
            },

            /**
             * Serializes all assets in the collection.
             * @returns {string}
             * @see grocer.Asset#toString
             */
            toString: function () {
                return this.items.join('\n');
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash# */{
            /**
             * Converts `Hash` instance with array items to `AssetCollection` instance.
             * @returns {grocer.AssetCollection}
             */
            toAssetCollection: function () {
                return grocer.AssetCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            toAssetCollection: function (assetType) {
                return this.toCollection()
                    .callOnEachItem('toAsset', assetType)
                    .toAssetCollection();
            }
        },
        false, false, false
    );
}());
