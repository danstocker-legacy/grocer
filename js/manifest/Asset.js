/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Asset', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.Asset.create
     * @function
     * @param {string} assetPath
     * @param {string} assetType
     * @returns {grocer.Asset}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.Asset = self
        .addMethods(/** @lends grocer.Asset# */{
            /**
             * @param {string} assetId
             * @param {string} assetType
             * @ignore
             */
            init: function (assetId, assetType) {
                dessert
                    .isString(assetId, "Invalid asset ID")
                    .isString(assetType, "Invalid asset type");

                /** @type {string} */
                this.assetId = assetId;

                /** @type {string} */
                this.assetType = assetType;
            },

            /**
             * @param {string} assetPrefix
             * @returns {grocer.Asset}
             */
            addPrefix: function (assetPrefix) {
                this.assetId = assetPrefix + this.assetId;
                return this;
            }

            /**
             * @name grocer.Asset#toString
             * @function
             * @returns {string}
             */
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @param {string} assetType
             * @returns {grocer.Asset}
             */
            toAsset: function (assetType) {
                return grocer.Asset.create(this.valueOf(), assetType);
            }
        },
        false, false, false
    );
}());
