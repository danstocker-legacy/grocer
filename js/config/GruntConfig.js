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
                        that.addTask(taskName, grocer.GruntTask.create(taskNode));
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
             * @param {string} taskName
             * @param {grocer.GruntTask} task
             * @returns {grocer.GruntConfig}
             */
            addTask: function (taskName, task) {
                dessert
                    .isString(taskName, "Invalid task name")
                    .isGruntTask(task, "Invalid task");

                this.tasks.setItem(taskName, task);

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
                    .mapKeys(function (taskName) {
                        return taskName;
                    })
                    .mapValues(function (taskName) {
                        var currentTask = that.getTask(taskName) || grocer.GruntTask.create(),
                            remoteTask = remoteConfig.getTask(taskName) || grocer.GruntTask.create();

                        return currentTask.mergeWith(remoteTask, subTaskPrefix);
                    })
                    .forEachItem(function (task, taskName) {
                        result.addTask(taskName, task);
                    });

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
