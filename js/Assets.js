/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Assets', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.Assets.create
     * @function
     * @param {string[]} assetPathList
     * @param {string} assetType
     * @returns {grocer.Assets}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.Assets = self
        .addMethods(/** @lends grocer.Assets# */{
            /**
             * @param {string[]} assetPathList
             * @param {string} assetType
             * @ignore
             */
            init: function (assetPathList, assetType) {
                dessert
                    .isArray(assetPathList, "Invalid asset list")
                    .isString(assetType, "Invalid asset type");

                /** @type {sntls.Collection} */
                this.assetCollection = assetPathList.toCollection()
                    .callOnEachItem('toAsset', assetType);
            },

            /** @returns {string} */
            toString: function () {
                return this.assetCollection
                    .items
                    .join('\n');
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash# */{
            /**
             * Converts `Hash` instance with array items to `Assets` instance.
             * @param {string} assetType
             * @returns {grocer.Assets}
             */
            toAssets: function (assetType) {
                dessert.isArray(this.items, "Invalid Hash");
                return grocer.Assets.create(this.items, assetType);
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
             * @returns {grocer.Assets}
             */
            toAssets: function (assetType) {
                return grocer.Assets.create(this, assetType);
            }
        },
        false, false, false
    );
}());
