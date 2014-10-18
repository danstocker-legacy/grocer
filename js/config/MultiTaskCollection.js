/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'MultiTaskCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.MultiTask),
        self = base.extend();

    /**
     * @name grocer.MultiTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {grocer.MultiTaskCollection}
     */

    /**
     * @class
     * @extends sntls.Collection
     * @extends grocer.MultiTask
     */
    grocer.MultiTaskCollection = self
        .addMethods(/** @lends grocer.MultiTaskCollection# */{
            /**
             * @param {string} [targetPrefix]
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                return this.callOnEachItem('getConfigNode', targetPrefix).items;
            },

            /**
             * @param {string} [targetPrefix]
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
        /** @returns {grocer.MultiTaskCollection} */
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
            /** @returns {grocer.MultiTaskCollection} */
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
