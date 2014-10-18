/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'CustomTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

    /**
     * Creates a CustomTask instance.
     * CustomTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name grocer.CustomTask.create
     * @function
     * @param {string} taskName Name of custom task.
     * @returns {grocer.CustomTask}
     * @see String#toCustomTask
     */

    /**
     * The CustomTask implements a 'custom' grunt task.
     * Custom tasks allow the user to implement custom tasks through a function.
     * @class
     * @extends grocer.GruntTask
     * @see http://gruntjs.com/creating-tasks#custom-tasks
     */
    grocer.CustomTask = self
        .addMethods(/** @lends grocer.CustomTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                base.init.call(this, taskName);

                /**
                 * Function that implements the custom task.
                 * @type {function}
                 */
                this.customHandler = undefined;
            },

            /**
             * Applies task by registering it via the grunt API.
             * @param {string} [description]
             * @returns {grocer.CustomTask}
             */
            applyTask: function (description) {
                grocer.GruntProxy.create()
                    .registerTask(this.taskName, description, this.customHandler);
                return this;
            },

            /**
             * Sets custom task handler. Overwrites previously set handler.
             * @param {function} customHandler Function that implements the custom task.
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
            /**
             * Converts string to CustomTask, treating the string as task name.
             * @returns {grocer.CustomTask}
             */
            toCustomTask: function () {
                return grocer.CustomTask.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
