/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'GruntTaskCollection', function () {
    "use strict";

    /**
     * Creates a GruntTaskCollection instance.
     * GruntTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name grocer.GruntTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {grocer.GruntTaskCollection}
     * @see Array#toGruntTaskCollection
     * @see sntls.Hash#toGruntTaskCollection
     */

    /**
     * The GruntTaskCollection class implements a typed collection for storing and managing
     * GruntTask instances.
     * @class
     * @extends sntls.Collection
     * @extends grocer.GruntTask
     */
    grocer.GruntTaskCollection = sntls.Collection.of(grocer.GruntTask);
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /**
         * Converts Hash to GruntTaskCollection. Hash items must be GruntTask instances.
         * @returns {grocer.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return grocer.GruntTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array to GruntTaskCollection. Array items must be GruntTask instances.
             * @returns {grocer.GruntTaskCollection}
             */
            toGruntTaskCollection: function () {
                return grocer.GruntTaskCollection.create(this);
            }
        },
        false, false, false
    );

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.GruntTaskCollection} expr */
        isGruntTaskCollection: function (expr) {
            return grocer.GruntTaskCollection.isBaseOf(expr);
        },

        /** @param {grocer.GruntTaskCollection} expr */
        isGruntTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.GruntTaskCollection.isBaseOf(expr);
        }
    });
}());
