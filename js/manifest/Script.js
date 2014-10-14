/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Script', function () {
    "use strict";

    var base = grocer.Asset,
        self = base.extend();

    /**
     * @name grocer.Script.create
     * @function
     * @param {string} assetPath
     * @returns {grocer.Script}
     */

    /**
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

            /** @returns {string} */
            toString: function () {
                return '<script src="' + this.assetId + '"></script>';
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
