/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'CustomTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

    /**
     * @name grocer.CustomTask.create
     * @function
     * @param {string} taskName
     * @returns {grocer.CustomTask}
     */

    /**
     * @class
     * @extends grocer.GruntTask
     */
    grocer.CustomTask = self
        .addMethods(/** @lends grocer.CustomTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                base.init.call(this, taskName);

                /** @type {function} */
                this.customHandler = undefined;
            },

            /**
             * @param {string} [description]
             * @returns {grocer.CustomTask}
             */
            registerTask: function (description) {
                grocer.GruntProxy.create()
                    .registerTask(this.taskName, description, this.customHandler);
                return this;
            },

            /**
             * @param {function} customHandler
             * @returns {grocer.CustomTask}
             */
            setCustomHandler: function (customHandler) {
                dessert.isFunction(customHandler, "Invalid custom handler");
                this.customHandler = customHandler;
                return this;
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {grocer.CustomTask} */
            toCustomTask: function () {
                return grocer.CustomTask.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
