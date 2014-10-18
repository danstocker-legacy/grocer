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
             * @param {grocer.MultiTask} multiTask
             * @returns {grocer.GruntConfig}
             */
            addTask: function (taskName, multiTask) {
                dessert
                    .isString(taskName, "Invalid task name")
                    .isMultiTask(multiTask, "Invalid multi task");

                this.toCollection()
                    .setItem(taskName, multiTask.getConfigNode());

                return this;
            },

            /**
             * @param {string} taskName
             * @returns {Object|Array}
             */
            getTask: function (taskName) {
                return this.toCollection().getItem(taskName);
            },

            /**
             * @param {boolean} [wipe]
             * @returns {grocer.GruntConfig}
             */
            applyConfig: function (wipe) {
                var gruntProxy = grocer.GruntProxy.create();
                if (wipe) {
                    gruntProxy.configInit(this.items);
                } else {
                    gruntProxy.configMerge(this.items);
                }
                return this;
            },

            /**
             * Returns a dictionary of unique targets as task names associated with all tasks for each target.
             * @returns {sntls.StringDictionary}
             */
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

            /**
             * Returns a typed collection with alias tasks for all targets.
             * @returns {grocer.GruntTaskCollection}
             */
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
                    }, undefined, grocer.GruntTaskCollection);
            },

            /**
             * Merges current config with remote config on the target level.
             * In case of conflict re. task/target combinations, the current config will win.
             * (Unless a suitable conflict resolver function is passed.)
             * @param {grocer.GruntConfig} remoteConfig
             * @param {function} [conflictResolver]
             * @returns {grocer.GruntConfig}
             * @see sntls.Collection#mergeWith
             */
            mergeWith: function (remoteConfig, conflictResolver) {
                dessert.isGruntConfig(remoteConfig, "Invalid grunt config");

                var targetQuery = '|>|'.toQuery(),

                // obtaining flattened targets for current config
                    currentTargets = this.queryPathValuePairsAsHash(targetQuery).toCollection(),

                // obtaining flattened targets for remote config
                    remoteTargets = remoteConfig.queryPathValuePairsAsHash(targetQuery).toCollection(),

                // merging target collections
                    mergedTargets = currentTargets.mergeWith(remoteTargets, conflictResolver),
                    mergedConfig = this.getBase().create();

                // inflating merged flattened target structure back into tree
                mergedTargets.forEachItem(function (targetConfigNode, targetPath) {
                    mergedConfig.setNode(targetPath.toPath(), targetConfigNode);
                });

                return mergedConfig;
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
