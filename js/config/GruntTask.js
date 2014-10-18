/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'GruntTask', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The BruntTask is a base class for specific grunt tasks.
     * Not to be instantiated on its own.
     * @class
     * @extends troop.Base
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
            },

            /**
             * Dummy super method just to be picked up by GruntTaskCollection.
             * Do not invoke. Override in subclasses.
             * @returns {grocer.GruntTask}
             */
            applyTask: function () {
                return this;
            }
        });
});
