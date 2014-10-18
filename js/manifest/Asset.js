/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Asset', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates an Asset instance.
     * Assets may also be created via conversion from string.
     * @name grocer.Asset.create
     * @function
     * @param {string} assetName Asset name, usually a relative path.
     * @param {string} assetType Asset type, eg. 'css', 'js', etc.
     * @returns {grocer.Asset}
     * @see String#toAsset
     */

    /**
     * The Asset class represents a single asset (file) of the application.
     * @class
     * @extends troop.Base
     */
    grocer.Asset = self
        .addMethods(/** @lends grocer.Asset# */{
            /**
             * @param {string} assetName
             * @param {string} assetType
             * @ignore
             */
            init: function (assetName, assetType) {
                dessert
                    .isString(assetName, "Invalid asset name")
                    .isString(assetType, "Invalid asset type");

                /**
                 * Asset name, usually a path relative to the project root.
                 * @type {string}
                 */
                this.assetName = assetName;

                /**
                 * Asset type, eg. 'css', 'js', etc.
                 * @type {string}
                 */
                this.assetType = assetType;
            },

            /**
             * Adds prefix to the asset name.
             * @param {string} assetPrefix
             * @returns {grocer.Asset}
             */
            addPrefix: function (assetPrefix) {
                this.assetName = assetPrefix + this.assetName;
                return this;
            }

            /**
             * Serializes the asset to string.
             * Typically used for inclusion in a project file, eg. index.html.
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
             * Converts string to Asset, interpreting the string as asset name.
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
