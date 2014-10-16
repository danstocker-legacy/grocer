/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'PluginTaskCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.PluginTask),
        self = base.extend();

    /**
     * @name grocer.PluginTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {grocer.PluginTaskCollection}
     */

    /**
     * @class
     * @extends sntls.Collection
     * @extends grocer.PluginTask
     */
    grocer.PluginTaskCollection = self
        .addMethods(/** @lends grocer.PluginTaskCollection# */{
            /** @returns {Object|Array} */
            getConfigNode: function () {
                return this.callOnEachItem('getConfigNode').items;
            },

            /** @returns {grocer.GruntConfig} */
            toGruntConfig: function () {
                return grocer.GruntConfig.create(this.getConfigNode());
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /** @returns {grocer.PluginTaskCollection} */
        toPluginTaskCollection: function () {
            return grocer.PluginTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /** @returns {grocer.PluginTaskCollection} */
            toPluginTaskCollection: function () {
                return grocer.PluginTaskCollection.create(this);
            }
        },
        false, false, false
    );
}());
