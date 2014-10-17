/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'GruntTaskCollection', function () {
    "use strict";

    /**
     * @name grocer.GruntTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {grocer.GruntTaskCollection}
     */

    /**
     * @class
     * @extends sntls.Collection
     * @extends grocer.GruntTask
     */
    grocer.GruntTaskCollection = sntls.Collection.of(grocer.GruntTask);
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /** @returns {grocer.GruntTaskCollection} */
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
            /** @returns {grocer.GruntTaskCollection} */
            toGruntTaskCollection: function () {
                return grocer.GruntTaskCollection.create(this);
            }
        },
        false, false, false
    );
}());
