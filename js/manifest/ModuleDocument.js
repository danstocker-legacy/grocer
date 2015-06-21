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
             * Retrieves the module name for the parent module.
             * @returns {Array}
             */
            getParent: function () {
                return this.getField('parent').getValue();
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
            },

            /**
             * Retrieves the 'loaded' flag for the current module.
             * @returns {boolean}
             */
            getLoaded: function () {
                return this.getField('loaded').getValue();
            },

            /**
             * Sets the 'loaded' flag for the current module.
             * @param {boolean} loaded
             * @returns {grocer.ModuleDocument}
             */
            setLoaded: function (loaded) {
                this.getField('loaded').setValue(loaded);
                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function () {
    "use strict";

    bookworm.Document.addSurrogate(grocer, 'ModuleDocument', function (documentKey) {
        return documentKey.documentType === 'module';
    });
});
