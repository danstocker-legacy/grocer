/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'DependencyPathCollection', function () {
    "use strict";

    var base = sntls.Collection.of(grocer.DependencyPath),
        self = base.extend();

    /**
     * @name grocer.DependencyPathCollection.create
     * @function
     * @param {object|Array} [items]
     * @returns {grocer.DependencyPathCollection}
     */

    /**
     * Represents a collection of end-to-end paths in the dependency tree.
     * @class
     * @extends sntls.Collection
     * @extends grocer.DependencyPath
     */
    grocer.DependencyPathCollection = self
        .addMethods(/** @lends grocer.DependencyPathCollection# */{
            /**
             * Retrieves all unique paths that match either the start or end of any path
             * in the current collection.
             * @returns {sntls.Collection}
             */
            getPathFragments: function () {
                var result = sntls.Collection.create();

                this.callOnEachItem('getPathFragments')
                    .forEachItem(function (pathFragmentCollection) {
                        pathFragmentCollection
                            .forEachItem(function (pathFragment) {
                                result.setItem(pathFragment.toString(), pathFragment);
                            });
                    });

                return result;
            }
        });
});
