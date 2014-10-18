/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Script', function () {
    "use strict";

    var base = grocer.Asset,
        self = base.extend();

    /**
     * Creates a Script asset instance.
     * Script assets may also be created via conversion from string.
     * @example
     * var css = 'foo.js'.toAsset('js');
     * @name grocer.Script.create
     * @function
     * @param {string} assetPath
     * @returns {grocer.Script}
     */

    /**
     * The Script class represents a JavaScript asset file.
     * @class
     * @extends grocer.Asset
     */
    grocer.Script = self
        .addMethods(/** @lends grocer.Script# */{
            /**
             * @param {string} assetPath
             * @ignore
             */
            init: function (assetPath) {
                base.init.call(this, assetPath, 'js');
            },

            /**
             * Generates a string based on the current script asset, for inclusion in HTML files.
             * @returns {string}
             */
            toString: function () {
                return '<script src="' + this.assetName + '"></script>';
            }
        });
});

troop.amendPostponed(grocer, 'Asset', function () {
    "use strict";

    grocer.Asset
        .addSurrogate(grocer, 'Script', function (assetPath, assetType) {
            return assetType === 'js';
        });
});
