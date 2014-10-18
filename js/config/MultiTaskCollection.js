/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'MultiTaskCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.MultiTask),
        self = base.extend();

    /**
     * Creates a MultiTaskCollection instance.
     * MultiTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name grocer.MultiTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {grocer.MultiTaskCollection}
     * @see Array#toMultiTaskCollection
     * @see sntls.Hash#toMultiTaskCollection
     */

    /**
     * The MultiTaskCollection class implements a typed collection for storing and managing
     * MultiTask instances. The main purpose of MultiTaskCollection is to provide conversion to
     * config-related objects and classes.
     * @class
     * @extends sntls.Collection
     * @extends grocer.MultiTask
     */
    grocer.MultiTaskCollection = self
        .addMethods(/** @lends grocer.MultiTaskCollection# */{
            /**
             * Generates a grunt config object for all tasks in the collection,
             * with targets optionally prefixed.
             * @param {string} [targetPrefix] Optional prefix for all targets of all tasks.
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                return this.callOnEachItem('getConfigNode', targetPrefix).items;
            },

            /**
             * Converts task collection to a GruntConfig instance.
             * @param {string} [targetPrefix] Optional prefix for all targets of all tasks.
             * @returns {grocer.GruntConfig}
             */
            toGruntConfig: function (targetPrefix) {
                return grocer.GruntConfig.create(this.getConfigNode(targetPrefix));
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /**
         * Converts Hash to MultiTaskCollection. Hash items must be MultiTask instances.
         * @returns {grocer.MultiTaskCollection}
         */
        toMultiTaskCollection: function () {
            return grocer.MultiTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array to MultiTaskCollection. Array items must be MultiTask instances.
             * @returns {grocer.MultiTaskCollection}
             */
            toMultiTaskCollection: function () {
                return grocer.MultiTaskCollection.create(this);
            }
        },
        false, false, false
    );

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.MultiTaskCollection} expr */
        isMultiTaskCollection: function (expr) {
            return grocer.MultiTaskCollection.isBaseOf(expr);
        },

        /** @param {grocer.MultiTaskCollection} expr */
        isMultiTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.MultiTaskCollection.isBaseOf(expr);
        }
    });
}());
