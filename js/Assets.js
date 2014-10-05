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
