/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Manifest', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.Manifest.create
     * @function
     * @param {object} manifestNode
     * @returns {grocer.Manifest}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.Manifest = self
        .addMethods(/** @lends grocer.Manifest# */{
            /**
             * @param {object} manifestNode
             * @ignore
             */
            init: function (manifestNode) {
                dessert.isObject(manifestNode, "Invalid manifest node");

                /** @type {sntls.Collection} */
                this.modules = sntls.Collection.create(manifestNode)
                    .createWithEachItem(grocer.Module);
            },

            /**
             * @param {string} moduleName
             * @returns {grocer.Module}
             */
            getModule: function (moduleName) {
                dessert.isString(moduleName, "Invalid module name");
                return this.modules.getItem(moduleName);
            },

            /**
             * @param {string} assetType
             * @returns {grocer.Assets}
             */
            getModulesAsAssets: function (assetType) {
                return this.modules.getKeysAsHash()
                    .toCollection()
                    .mapValues(function (assetId) {
                        return assetId + '.' + assetType;
                    })
                    .toAssets(assetType);
            }
        });
});
