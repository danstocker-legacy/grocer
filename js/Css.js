/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Css', function () {
    "use strict";

    var base = grocer.Asset,
        self = base.extend();

    /**
     * @name grocer.Css.create
     * @function
     * @param {string} assetPath
     * @returns {grocer.Css}
     */

    /**
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

            /** @returns {string} */
            toString: function () {
                return '<link rel="stylesheet" href="' + this.assetId + '" />';
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
