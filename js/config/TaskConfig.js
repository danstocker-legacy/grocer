/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'TaskConfig', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.TaskConfig.create
     * @function
     * @param {object} [taskNode]
     * @returns {grocer.TaskConfig}
     */

    /**
     * @class
     * @extends troop.Base
     */
    grocer.TaskConfig = self
        .addMethods(/** @lends grocer.TaskConfig# */{
            /**
             * @param {object} [taskNode]
             * @ignore
             */
            init: function (taskNode) {
                dessert.isObjectOptional(taskNode, "Invalid task node");

                /** @type {sntls.Collection} */
                this.targets = sntls.Collection.create(taskNode);
            },

            /**
             * @param {string} targetName
             * @param {object} targetNode
             * @returns {grocer.TaskConfig}
             */
            addTarget: function (targetName, targetNode) {
                this.targets.setItem(targetName, targetNode);
                return this;
            },

            /**
             * @param {grocer.TaskConfig} remoteTask
             * @param {string} [targetPrefix]
             * @returns {grocer.TaskConfig}
             */
            mergeWith: function (remoteTask, targetPrefix) {
                dessert
                    .isTaskConfig(remoteTask, "Invalid remote task")
                    .isStringOptional(targetPrefix, "Invalid target prefix");

                var result = this.getBase().create();

                targetPrefix = targetPrefix || '';

                this.targets
                    .forEachItem(function (targetNode, targetName) {
                        result.addTarget(targetName, targetNode);
                    });

                remoteTask.targets
                    .forEachItem(function (targetNode, targetName) {
                        result.addTarget(targetPrefix + targetName, targetNode);
                    });

                return result;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.TaskConfig} expr */
        isTaskConfig: function (expr) {
            return grocer.TaskConfig.isBaseOf(expr);
        },

        /** @param {grocer.TaskConfig} expr */
        isTaskConfigOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.TaskConfig.isBaseOf(expr);
        }
    });
}());
