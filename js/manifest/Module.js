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
     * @returns {grocer.Module}
     * @see String#toModule
     */

    /**
     * The Module class represents the assets that make up a single module of the application.
     * A Module may also point to a symbol through which the application can use it.
     * (Eg. a page class that needs to be instantiated before opening that page, assuming that
     * modules correspond to pages.)
     * @class
     * @extends troop.Base
     */
    grocer.Module = self
        .addMethods(/** @lends grocer.Module# */{
            /**
             * @param {string} moduleName
             * @ignore
             */
            init: function (moduleName) {
                dessert.isString(moduleName, "Invalid module name");

                /**
                 * Document key identifying the module.
                 * @type {bookworm.DocumentKey}
                 */
                this.entityKey = ['module', moduleName].toDocumentKey();
            },

            /**
             * Converts module to a single asset.
             * To be used for reducing all assets within the module to a single file ie.
             * via concatenation, minification, etc.
             * @example
             * 'foo'.toModule({hello: 'world'}).toAsset() // 'foo.js'.toAsset('js')
             * @param {string} assetType
             * @returns {grocer.Asset}
             */
            toAsset: function (assetType) {
                var moduleDocument = this.entityKey.toDocument();

                dessert.isString(assetType, "Invalid asset type");

                return moduleDocument.hasAssetType(assetType) ?
                    (moduleDocument.getModuleName() + '.' + assetType).toAsset(assetType) :
                    undefined;
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {grocer.Module}
             */
            toModule: function () {
                return grocer.Module.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
