/*global dessert, troop, sntls, bookworm, grocer */
troop.postpone(grocer, 'ModuleDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name grocer.ModuleDocument.create
     * @function
     * @returns {grocer.ModuleDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    grocer.ModuleDocument = self
        .addMethods(/** @lends grocer.ModuleDocument# */{
            /**
             * Retrieves the module name.
             * @returns {string}
             */
            getModuleName: function () {
                return this.entityKey.documentId;
            },

            /**
             * Retrieves a flat array of dependencies.
             * @returns {Array}
             */
            getDependencies: function () {
                return this.getField('dependencies').getValue();
            },

            /**
             * Tests whether the current module has any assets of the specified type.
             * @param {string} assetType
             * @returns {boolean}
             */
            hasAssetType: function (assetType) {
                return !!this.getField('assets').getAttribute(assetType).getNodeAsHash().getKeyCount();
            },

            /**
             * Retrieves assets of the specified type as a flat collection.
             * @param {string} assetType
             * @returns {Array}
             */
            getAssetsForType: function (assetType) {
                return this.getField('assets').getAttribute(assetType).getNode();
            },

            /**
             * Retrieves JavaScript symbol associated with module.
             * @returns {string}
             */
            getSymbol: function () {
                return this.getField('symbol').getValue();
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function () {
    "use strict";

    bookworm.Document.addSurrogate(grocer, 'ModuleDocument', function (documentKey) {
        return documentKey.documentType === 'module';
    });
});
