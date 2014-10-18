/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'Module', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a Module instance.
     * Module instances may also be created via conversion from string. The string in this case is
     * interpreted as the name of the module.
     * @name grocer.Module.create
     * @function
     * @param {string} moduleName
     * @param {object} moduleNode
     * @returns {grocer.Module}
     * @see String#toModule
     */

    /**
     * The Module class represents the assets that make up a single module of the application.
     * @class
     * @extends troop.Base
     */
    grocer.Module = self
        .addMethods(/** @lends grocer.Module# */{
            /**
             * @param {string} moduleName
             * @param {object} moduleNode
             * @ignore
             */
            init: function (moduleName, moduleNode) {
                dessert
                    .isString(moduleName, "Invalid module name")
                    .isObject(moduleNode, "Invalid module node");

                /** @type {sntls.Tree} moduleNode */
                var moduleDescriptor = sntls.Tree.create(moduleNode),
                    classPath = moduleDescriptor.getNode('classPath'.toPath());

                /**
                 * Name of the module. The module name must be unique within the application.
                 * @type {string}
                 */
                this.moduleName = moduleName;

                /**
                 * Class path associated with the module. The class path identifies the module's
                 * main symbol (object, function, class, etc.) relative to the global object.
                 * @type {sntls.Path}
                 */
                this.classPath = classPath ?
                    classPath.toPathFromClassPath() :
                    undefined;

                /**
                 * Collection of asset collections. Within a module, there's an asset collection associated
                 * with each available asset type.
                 * @type {sntls.Collection}
                 */
                this.assetCollections = moduleDescriptor
                    .getNodeAsHash('assets'.toPath())
                    .toCollection()
                    .mapValues(function (/**Array*/assets, assetType) {
                        return assets.toAssetCollection(assetType);
                    });
            },

            /**
             * Fetches all assets in the module for the specified asset type.
             * @param {string} assetType
             * @returns {grocer.AssetCollection}
             */
            getAssets: function (assetType) {
                dessert.isString(assetType, "Invalid asset type");
                return this.assetCollections.getItem(assetType);
            },

            /**
             * Fetches all assets in the
             * @param {string} assetType
             * @returns {string[]}
             */
            getAssetNames: function (assetType) {
                dessert.isString(assetType, "Invalid asset type");
                var assets = this.assetCollections.getItem(assetType);
                return assets ?
                    assets.getAssetNames() :
                    [];
            },

            /**
             * @param {string} assetType
             * @returns {grocer.Asset}
             */
            toAsset: function (assetType) {
                dessert
                    .isString(assetType, "Invalid asset type")
                    .assert(this.assetCollections.getItem(assetType), "Invalid assetType");
                return (this.moduleName + '.' + assetType).toAsset(assetType);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @param {object} [moduleNode]
             * @returns {grocer.Module}
             */
            toModule: function (moduleNode) {
                return grocer.Module.create(this.valueOf(), moduleNode);
            }
        },
        false, false, false
    );
}());
