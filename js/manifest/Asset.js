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
     * @param {string} assetPath Asset name, usually a relative path.
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
             * @param {string} assetPath
             * @param {string} assetType
             * @ignore
             */
            init: function (assetPath, assetType) {
                dessert
                    .isString(assetPath, "Invalid asset path")
                    .isString(assetType, "Invalid asset type");

                /**
                 * Asset name, usually a path relative to the project root.
                 * @type {string}
                 */
                this.assetPath = assetPath;

                /**
                 * Asset type, eg. 'css', 'js', etc.
                 * @type {string}
                 */
                this.assetType = assetType;
            },

            /**
             * Adds prefix to the asset path.
             * @param {string} assetPrefix
             * @returns {grocer.Asset}
             */
            addPrefix: function (assetPrefix) {
                this.assetPath = assetPrefix + this.assetPath;
                return this;
            },

            /**
             * Extracts file name from asset path.
             * @returns {string}
             */
            getAssetFileName: function () {
                return this.assetPath.split('/').pop();
            },

            /**
             * Extracts asset base name (file name without extension) from asset path.
             * @returns {string}
             */
            getAssetBaseName: function () {
                var assetParts = this.getAssetFileName().split('.');
                assetParts.pop();
                return assetParts.join('.');
            },

            /**
             * Extracts file extension from asset path.
             * @returns {string}
             */
            getAssetExtension: function () {
                return this.assetPath.split('.').pop();
            },

            /**
             * An Asset when serialized should return a string that can be placed in an HTML
             * file for inclusion. By default, just returns the asset path.
             * @returns {string}
             */
            toString: function () {
                return this.assetPath;
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to Asset, interpreting the string as asset path.
             * @param {string} assetType
             * @returns {grocer.Asset}
             */
            toAsset: function (assetType) {
                return grocer.Asset.create(this.valueOf(), assetType);
            }
        },
        false, false, false);
}());
