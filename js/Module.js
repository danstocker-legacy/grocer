/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Module', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.Module.create
     * @function
     * @param {object} moduleNode
     * @returns {grocer.Module}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.Module = self
        .addMethods(/** @lends grocer.Module# */{
            /**
             * @param {object} moduleNode
             * @ignore
             */
            init: function (moduleNode) {
                dessert.isObject(moduleNode, "Invalid module node");

                /** @type {sntls.Tree} moduleNode */
                this.moduleDescriptor = sntls.Tree.create(moduleNode);

                var classPath = this.moduleDescriptor.getNode('classPath'.toPath());

                /** @type {sntls.Path} */
                this.classPath = classPath ?
                    classPath.toPathFromClassPath() :
                    undefined;

                /** @type {sntls.Collection} */
                this.assetsCollection = this.moduleDescriptor
                    .getNodeAsHash('assets'.toPath())
                    .toCollection()
                    .mapValues(function (assetList, assetType) {
                        return grocer.Assets.create(assetList, assetType);
                    });
            },

            /**
             * @param {string} assetType
             * @returns {grocer.Assets}
             */
            getAssets: function (assetType) {
                dessert.isString(assetType, "Invalid asset type");
                return this.assetsCollection.getItem(assetType);
            }
        });
});
