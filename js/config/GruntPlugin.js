/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntPlugin', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a GruntPlugin instance.
     * GruntPlugin instances may also be created via conversion from String,
     * treating the string as the name of the package.
     * @example
     * grocer.GruntPlugin.create('grunt-contrib-copy')
     * @name grocer.GruntPlugin.create
     * @function
     * @param {string} packageName Name of the NPM package associated with the grunt plugin.
     * @returns {grocer.GruntPlugin}
     * @see String#toGruntPlugin
     */

    /**
     * The GruntPlugin class represents a grunt plugin.
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

                /**
                 * Name of the NPM package associated with the grunt plugin.
                 * @type {string}
                 */
                this.packageName = packageName;
            },

            /**
             * Loads the grunt plugin via the grunt API.
             * @returns {grocer.GruntPlugin}
             */
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
            /**
             * Converts string to GruntPlugin, treating the string as the name of an NPM package.
             * @returns {grocer.AliasTask}
             */
            toGruntPlugin: function () {
                return grocer.GruntPlugin.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
