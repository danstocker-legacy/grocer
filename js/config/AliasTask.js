/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'AliasTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

    /**
     * @name grocer.AliasTask.create
     * @function
     * @param {string} taskName
     * @returns {grocer.AliasTask}
     */

    /**
     * @class
     * @extends grocer.GruntTask
     */
    grocer.AliasTask = self
        .addMethods(/** @lends grocer.AliasTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                base.init.call(this, taskName);

                /** @type {sntls.Collection} */
                this.subTasks = sntls.Collection.create();
            },

            /**
             * @param {string} [description]
             * @returns {grocer.AliasTask}
             */
            registerTask: function (description) {
                grocer.GruntProxy.create()
                    .registerTask(this.taskName, description, this.subTasks.getValues());
                return this;
            },

            /**
             * @param {string} subTask
             * @returns {grocer.AliasTask}
             */
            addSubTask: function (subTask) {
                dessert.isString(subTask, "Invalid sub-task name");
                this.subTasks.setItem(subTask, subTask);
                return this;
            },

            /** @returns {grocer.AliasTask} */
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
            /** @returns {grocer.AliasTask} */
            toAliasTask: function () {
                return grocer.AliasTask.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
