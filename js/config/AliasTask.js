/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'AliasTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * Creates an AliasTask instance.
     * AliasTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name grocer.AliasTask.create
     * @function
     * @param {string} taskName Name of alias task.
     * @returns {grocer.AliasTask}
     * @see String#toAliasTask
     */

    /**
     * The AliasTask implements an 'alias' grunt task.
     * Alias grunt tasks group other tasks into a single task.
     * @class
     * @extends grocer.GruntTask
     * @see http://gruntjs.com/creating-tasks#alias-tasks
     */
    grocer.AliasTask = self
        .setInstanceMapper(function (taskName) {
            return taskName;
        })
        .addMethods(/** @lends grocer.AliasTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                base.init.call(this, taskName);

                /**
                 * Array of task names that the current alias task groups together.
                 * @type {string[]}
                 */
                this.subTasks = [];
            },

            /**
             * Applies task by registering it via the grunt API.
             * @param {string} [description] Optional description of the task.
             * @returns {grocer.AliasTask}
             */
            applyTask: function (description) {
                grocer.GruntProxy.create()
                    .registerTask(this.taskName, description, this.subTasks);
                return this;
            },

            /**
             * Adds sub-task to the current alias task as the last sub-task.
             * @param {string} taskName Name of sub-task to be added.
             * @returns {grocer.AliasTask}
             */
            addSubTask: function (taskName) {
                dessert.isString(taskName, "Invalid sub-task name");
                this.subTasks.push(taskName);
                return this;
            },

            /**
             * Adds sub-task to the alias task after the last occurrence of the specified sub-task,
             * or at the end when the specified sub-task does not exist.
             * @param {string} taskName
             * @param {string} [afterTaskName]
             * @returns {grocer.AliasTask}
             */
            addSubTaskAfter: function (taskName, afterTaskName) {
                var subTasks = this.subTasks,
                    sliceIndex = subTasks.lastIndexOf(afterTaskName);

                if (sliceIndex >= 0) {
                    subTasks.splice(sliceIndex + 1, 0, taskName);
                } else {
                    subTasks.push(taskName);
                }

                return this;
            },

            /**
             * Adds sub-task to the alias task before the first occurrence of the specified sub-task,
             * or at the beginning when the specified sub-task does not exist.
             * @param {string} taskName
             * @param {string} [beforeTaskName]
             * @returns {grocer.AliasTask}
             */
            addSubTaskBefore: function (taskName, beforeTaskName) {
                var subTasks = this.subTasks,
                    sliceIndex = subTasks.indexOf(beforeTaskName);

                if (sliceIndex >= 0) {
                    subTasks.splice(sliceIndex, 0, taskName);
                } else {
                    subTasks.unshift(taskName);
                }

                return this;
            },

            /**
             * Adds multiple sub-tasks. Each argument represents a sub-task.
             * @returns {grocer.AliasTask}
             */
            addSubTasks: function () {
                this.subTasks = this.subTasks.concat(slice.call(arguments));
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
             * Converts string to AliasTask, treating the string as task name.
             * @returns {grocer.AliasTask}
             */
            toAliasTask: function () {
                var aliasTask = grocer.AliasTask.create(this.valueOf());
                aliasTask.addSubTasks.apply(aliasTask, arguments);
                return aliasTask;
            }
        },
        false, false, false
    );
}());
