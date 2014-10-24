/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'GruntTask', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a GruntTask instance.
     * GruntTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name grocer.CustomTask.create
     * @function
     * @param {string} taskName Name of the task.
     * @returns {grocer.GruntTask}
     * @see String#toGruntTask
     */

    /**
     * The GruntTask implements a basic grunt task.
     * Basic tasks allow the user to implement tasks with a custom task handler.
     * @class
     * @extends troop.Base
     * @see http://gruntjs.com/creating-tasks#basic-tasks
     * @see http://gruntjs.com/creating-tasks#custom-tasks
     */
    grocer.GruntTask = self
        .addMethods(/** @lends grocer.GruntTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                dessert.isString(taskName, "Invalid task name");

                /**
                 * Name of the grunt task.
                 * @type {string}
                 */
                this.taskName = taskName;

                /**
                 * Function that implements the task.
                 * @type {function}
                 */
                this.taskHandler = undefined;
            },

            /**
             * Applies task by registering it via the grunt API.
             * @param {string} [description]
             * @returns {grocer.GruntTask}
             */
            applyTask: function (description) {
                grocer.GruntProxy.create()
                    .registerTask(this.taskName, description, this.taskHandler);
                return this;
            },

            /**
             * Sets task handler. Overwrites previously set handler.
             * @param {function} taskHandler Function that implements the task.
             * @returns {grocer.GruntTask}
             */
            setTaskHandler: function (taskHandler) {
                dessert.isFunction(taskHandler, "Invalid task handler");
                this.taskHandler = taskHandler;
                return this;
            },

            /**
             * Adds current task to a collection of tasks.
             * @param {grocer.MultiTaskCollection} taskCollection Collection to add the task to.
             * @returns {grocer.GruntTask}
             */
            addToCollection: function (taskCollection) {
                dessert.isGruntTaskCollection(taskCollection, "Invalid grunt task collection");
                taskCollection.setItem(this.taskName, this);
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
             * Converts string to GruntTask, treating the string as task name.
             * @returns {grocer.GruntTask}
             */
            toGruntTask: function () {
                return grocer.GruntTask.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
