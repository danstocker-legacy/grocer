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

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.PluginTaskCollection} expr */
        isPluginTaskCollection: function (expr) {
            return grocer.PluginTaskCollection.isBaseOf(expr);
        },

        /** @param {grocer.PluginTaskCollection} expr */
        isPluginTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.PluginTaskCollection.isBaseOf(expr);
        }
    });
}());
