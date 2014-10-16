/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntConfig', function () {
    "use strict";

    var base = sntls.Tree,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name grocer.GruntConfig.create
     * @function
     * @param {object} [items]
     * @returns {grocer.GruntConfig}
     */

    /**
     * @class
     * @extends sntls.Tree
     */
    grocer.GruntConfig = self
        .addMethods(/** @lends grocer.GruntConfig# */{
            /**
             * @param {string} taskName
             * @param {grocer.PluginTask} pluginTask
             * @returns {grocer.GruntConfig}
             */
            addTask: function (taskName, pluginTask) {
                dessert
                    .isString(taskName, "Invalid task name")
                    .isPluginTask(pluginTask, "Invalid plugin task");

                this.toCollection()
                    .setItem(taskName, pluginTask.getConfigNode());

                return this;
            },

            /**
             * @param {string} taskName
             * @returns {Object|Array}
             */
            getTask: function (taskName) {
                return this.toCollection().getItem(taskName);
            },

            /** @returns {grocer.GruntConfig} */
            initConfig: function () {
                grocer.GruntProxy.create().initConfig(this.items);
                return this;
            },

            /** @returns {sntls.Hash} */
            getTasksGroupedByTarget: function () {
                var args = slice.call(arguments),
                    query = ['|'.toKVP(), (args.length ? args : '|').toKVP()].toQuery();

                return this.queryPathValuePairsAsHash(query)
                    .toCollection()
                    .mapValues(function (targetNode, path) {
                        return path.toPath().getLastKey();
                    })
                    .mapKeys(function (targetNode, path) {
                        return path.toPath().asArray.join(':');
                    })
                    .toStringDictionary()
                    .reverse();
            },

            /** @returns {sntls.Collection} */
            getAliasTasksGroupedByTarget: function () {
                var groupedTasks = this.getTasksGroupedByTarget.apply(this, arguments);

                return groupedTasks
                    .toCollection()
                    .mapValues(function (taskNames, targetName) {
                        var aliasTask = targetName.toAliasTask();

                        if (taskNames instanceof Array) {
                            aliasTask.addSubTasks.apply(aliasTask, taskNames);
                        } else {
                            aliasTask.addSubTask(taskNames);
                        }

                        return aliasTask;
                    });
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
