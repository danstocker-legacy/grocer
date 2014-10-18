/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'AssetCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.Asset),
        self = base.extend();

    /**
     * @name grocer.AssetCollection.create
     * @function
     * @param {Asset[]} items
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
             * @param {Asset[]} items
             * @ignore
             */
            init: function (items) {
                dessert.isArray(items, "Invalid asset list");
                base.init.call(this, items);
            },

            /**
             * Retrieves an array of asset names based on the assets in the collection.
             * @returns {string[]}
             */
            getAssetNames: function () {
                return this
                    .mapValues(function (/**grocer.Asset*/asset) {
                        return asset.assetName;
                    })
                    .items;
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
