/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Css', function () {
    "use strict";

    var base = grocer.Asset,
        self = base.extend();

    /**
     * Creates a Css asset instance.
     * Css assets may also be created via conversion from string.
     * @example
     * var css = 'foo.css'.toAsset('css');
     * @name grocer.Css.create
     * @function
     * @param {string} assetPath
     * @returns {grocer.Css}
     */

    /**
     * The Css class represents a style sheet asset file.
     * @class
     * @extends grocer.Asset
     */
    grocer.Css = self
        .addMethods(/** @lends grocer.Css# */{
            /**
             * @param {string} assetPath
             * @ignore
             */
            init: function (assetPath) {
                base.init.call(this, assetPath, 'css');
            },

            /**
             * Generates a string based on the current CSS asset, for inclusion in HTML files.
             * @returns {string}
             */
            toString: function () {
                return '<link rel="stylesheet" href="' + this.assetName + '" />';
            }
        });
});

troop.amendPostponed(grocer, 'Asset', function () {
    "use strict";

    grocer.Asset
        .addSurrogate(grocer, 'Css', function (assetPath, assetType) {
            return assetType === 'css';
        });
});
