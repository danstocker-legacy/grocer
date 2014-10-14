/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'GruntTask', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.GruntTask.create
     * @function
     * @param {string} taskName
     * @returns {grocer.GruntTask}
     */

    /**
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

                /** @type {string} */
                this.taskName = taskName;
            }

            /**
             * @name grocer.GruntTask#registerTask
             * @function
             * @param {string} [description]
             * @returns {grocer.GruntTask}
             */
        });
});
