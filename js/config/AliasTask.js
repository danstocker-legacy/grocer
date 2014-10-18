/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'AliasTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

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
        .addMethods(/** @lends grocer.AliasTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                base.init.call(this, taskName);

                /**
                 * Collection of task names that the current alias task groups together.
                 * @type {sntls.Collection}
                 */
                this.subTasks = sntls.Collection.create();
            },

            /**
             * Applies task by registering it via the grunt API.
             * @param {string} [description] Optional description of the task.
             * @returns {grocer.AliasTask}
             */
            applyTask: function (description) {
                grocer.GruntProxy.create()
                    .registerTask(this.taskName, description, this.subTasks.getValues());
                return this;
            },

            /**
             * Adds sub-task to the current alias task.
             * @param {string} taskName Name of sub-task to be added.
             * @returns {grocer.AliasTask}
             */
            addSubTask: function (taskName) {
                dessert.isString(taskName, "Invalid sub-task name");
                this.subTasks.setItem(taskName, taskName);
                return this;
            },

            /**
             * Adds multiple sub-tasks. Each argument represents a sub-task.
             * @returns {grocer.AliasTask}
             */
            addSubTasks: function () {
                var i;
                for (i = 0; i < arguments.length; i++) {
                    this.addSubTask(arguments[i]);
                }
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
                return grocer.AliasTask.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
