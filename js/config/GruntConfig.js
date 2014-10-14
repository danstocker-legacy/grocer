/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntConfig', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.GruntConfig.create
     * @function
     * @param {object} [configNode]
     * @returns {grocer.GruntConfig}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.GruntConfig = self
        .addPrivateMethods(/** @lends grocer.GruntConfig# */{
            /**
             * @param {object} configNode
             * @private
             */
            _parseConfigNode: function (configNode) {
                var that = this;
                sntls.Collection.create(configNode)
                    .forEachItem(function (taskNode, taskName) {
                        that.addTask(grocer.GruntTask.create(taskName, taskNode));
                    });
            }
        })
        .addMethods(/** @lends grocer.GruntConfig# */{
            /**
             * @param {object} [configNode]
             * @ignore
             */
            init: function (configNode) {
                dessert.isObjectOptional(configNode, "Invalid config node");

                /** @type {sntls.Collection} */
                this.tasks = sntls.Collection.create();

                this._parseConfigNode(configNode);
            },

            /**
             * @param {grocer.GruntTask} task
             * @returns {grocer.GruntConfig}
             */
            addTask: function (task) {
                dessert.isGruntTask(task, "Invalid task");
                this.tasks.setItem(task.taskName, task);
                return this;
            },

            /**
             * @param {string} taskName
             * @returns {grocer.GruntTask}
             */
            getTask: function (taskName) {
                return this.tasks.getItem(taskName);
            },

            /** @returns {Object} */
            getConfigNode: function () {
                return this.tasks.mapValues(function (/**grocer.GruntTask*/task) {
                    return task.subTasks.items;
                }).items;
            },

            /**
             * @param {grocer.GruntConfig} remoteConfig
             * @param {string} [subTaskPrefix]
             * @returns {troop.Base}
             */
            mergeWith: function (remoteConfig, subTaskPrefix) {
                dessert.isGruntConfig(remoteConfig, "Invalid remote grunt config");

                var that = this,
                    result = this.getBase().create(),
                    combinedTaskNames = this.tasks.toSet()
                        .unionWith(remoteConfig.tasks.toSet())
                        .getKeysAsHash()
                        .toCollection();

                combinedTaskNames
                    .mapValues(function (taskName) {
                        var currentTask = that.getTask(taskName) || grocer.GruntTask.create(taskName),
                            remoteTask = remoteConfig.getTask(taskName) || grocer.GruntTask.create(taskName);

                        return currentTask.mergeWith(remoteTask, subTaskPrefix);
                    })
                    .passEachItemTo(result.addTask, result);

                return result;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.GruntConfig} expr */
        isGruntConfig: function (expr) {
            return grocer.GruntConfig.isBaseOf(expr);
        },

        /** @param {grocer.GruntConfig} expr */
        isGruntConfigOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.GruntConfig.isBaseOf(expr);
        }
    });
}());
