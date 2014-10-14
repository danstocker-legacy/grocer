/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntTask', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.GruntTask.create
     * @function
     * @param {string} taskName
     * @param {object} [taskNode]
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
             * @param {object} [taskNode]
             * @ignore
             */
            init: function (taskName, taskNode) {
                dessert
                    .isString(taskName, "Invalid task name")
                    .isObjectOptional(taskNode, "Invalid task node");

                /** @type {string} */
                this.taskName = taskName;

                /** @type {sntls.Collection} */
                this.subTasks = sntls.Collection.create(taskNode);
            },

            /**
             * @param {string} subTaskName
             * @param {object} subTaskNode
             * @returns {grocer.GruntTask}
             */
            addSubTask: function (subTaskName, subTaskNode) {
                this.subTasks.setItem(subTaskName, subTaskNode);
                return this;
            },

            /**
             * @param {grocer.GruntTask} remoteTask
             * @param {string} [subTaskPrefix]
             * @returns {grocer.GruntTask}
             */
            mergeWith: function (remoteTask, subTaskPrefix) {
                dessert
                    .isGruntTask(remoteTask, "Invalid remote task")
                    .isStringOptional(subTaskPrefix, "Invalid sub-task prefix");

                var result = this.getBase().create(this.taskName);

                subTaskPrefix = subTaskPrefix || '';

                this.subTasks
                    .forEachItem(function (subTaskNode, subTaskName) {
                        result.addSubTask(subTaskName, subTaskNode);
                    });

                remoteTask.subTasks
                    .forEachItem(function (subTaskNode, subTaskName) {
                        result.addSubTask(subTaskPrefix + subTaskName, subTaskNode);
                    });

                return result;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.GruntTask} expr */
        isGruntTask: function (expr) {
            return grocer.GruntTask.isBaseOf(expr);
        },

        /** @param {grocer.GruntTask} expr */
        isGruntTaskOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.GruntTask.isBaseOf(expr);
        }
    });
}());
