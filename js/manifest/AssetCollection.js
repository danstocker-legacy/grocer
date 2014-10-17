/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'AssetCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.Asset),
        self = base.extend();

    /**
     * @name grocer.AssetCollection.create
     * @function
     * @param {string[]} assetPathList
     * @returns {grocer.AssetCollection}
     */

    /**
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

            /** @returns {string[]} */
            getAssetList: function () {
                return this
                    .mapValues(function (/**grocer.Asset*/asset) {
                        return asset.assetId;
                    })
                    .items;
            },

            /** @returns {string} */
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
