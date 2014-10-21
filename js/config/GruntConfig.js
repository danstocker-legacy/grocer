/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntConfig', function () {
    "use strict";

    var base = sntls.Tree,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * Creates a GruntConfig instance.
     * @name grocer.GruntConfig.create
     * @function
     * @param {object} [items]
     * @returns {grocer.GruntConfig}
     */

    /**
     * The GruntConfig class represents and manages grunt config objects, including adding tasks to,
     * applying, merging configs.
     * @class
     * @extends sntls.Tree
     */
    grocer.GruntConfig = self
        .addPrivateMethods(/** @lends grocer.GruntConfig# */{
            /**
             * Returns a dictionary of unique targets as task names associated with task names for each target.
             * @returns {sntls.StringDictionary}
             * @private
             */
            _getAliasTaskAssociations: function () {
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
            }
        })
        .addMethods(/** @lends grocer.GruntConfig# */{
            /**
             * Adds a (multi-)task to the config.
             * @param {grocer.MultiTask} multiTask Task to be added to config.
             * @returns {grocer.GruntConfig}
             */
            addMultiTask: function (multiTask) {
                dessert.isMultiTask(multiTask, "Invalid multi task");

                this.toCollection()
                    .setItem(multiTask.taskName, multiTask.getConfigNode());

                return this;
            },

            /**
             * Fetches the config node for the specified task.
             * @param {string} taskName
             * @returns {Object|Array}
             */
            getTaskConfig: function (taskName) {
                return this.toCollection().getItem(taskName);
            },

            /**
             * Applies config via the grunt API. Overwrites tasks in the current config.
             * When the optional `wipe` argument is set, it also removes all other tasks leaving only those
             * being applied.
             * @param {boolean} [wipe] Whether to remove tasks not in current config.
             * @returns {grocer.GruntConfig}
             */
            applyConfig: function (wipe) {
                var gruntProxy = grocer.GruntProxy.create();
                if (wipe) {
                    gruntProxy.configInit(this.items);
                } else {
                    this.queryPathValuePairsAsHash('|>|'.toQuery())
                        .toCollection()
                        .forEachItem(function (targetConfigNode, targetPath) {
                            var prop = targetPath.toPath().asArray
                                .toCollection()
                                .mapValues(gruntProxy.configEscape, gruntProxy)
                                .items
                                .join('.');

                            gruntProxy.configSet(prop, targetConfigNode);
                        });
                }
                return this;
            },

            /**
             * Applies config by merging current config to previously applied config(s) via the grunt API.
             * @returns {grocer.GruntConfig}
             */
            mergeConfig: function () {
                var gruntProxy = grocer.GruntProxy.create();
                gruntProxy.configMerge(this.items);
                return this;
            },

            /**
             * Returns a typed collection with alias tasks for the specified targets (as arguments),
             * or all targets (no arguments).
             * @returns {grocer.GruntTaskCollection}
             */
            getAliasTasksGroupedByTarget: function () {
                var groupedTasks = this._getAliasTaskAssociations.apply(this, arguments);

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
