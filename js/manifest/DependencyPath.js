/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'DependencyPath', function () {
    "use strict";

    var base = sntls.Path,
        self = base.extend();

    /**
     * @name grocer.DependencyPath.create
     * @function
     * @param {string[]} path
     * @returns {grocer.DependencyPath}
     */

    /**
     * Represents an end-to-end path in the dependency tree.
     * @class
     * @extends sntls.Path
     */
    grocer.DependencyPath = self
        .addMethods(/** @lends grocer.DependencyPath# */{
            /**
             * Retrieves all unique paths that match the start or end of the current path.
             * @returns {sntls.Collection}
             */
            getPathFragments: function () {
                var asArray = this.asArray,
                    result = sntls.Collection.create(),
                    i, pathA, pathB;

                for (i = 0; i < asArray.length; i++) {
                    pathA = asArray.slice(0, i + 1).toPath();
                    pathB = asArray.slice(i).toPath();
                    result.setItem(pathA.toString(), pathA);
                    result.setItem(pathB.toString(), pathB);
                }

                return result.toCollection();
            }
        });
});
