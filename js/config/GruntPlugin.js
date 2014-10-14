/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntPlugin', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.GruntPlugin.create
     * @function
     * @returns {grocer.GruntPlugin}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.GruntPlugin = self
        .addMethods(/** @lends grocer.GruntPlugin# */{
            /**
             * @param {string} packageName
             * @ignore
             */
            init: function (packageName) {
                dessert.isString(packageName, "Invalid package name");

                /** @type {string} */
                this.packageName = packageName;
            },

            /** @returns {grocer.GruntPlugin} */
            loadPlugin: function () {
                grocer.GruntProxy.create().loadNpmTasks(this.packageName);
                return this;
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {grocer.AliasTask} */
            toGruntPlugin: function () {
                return grocer.GruntPlugin.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
