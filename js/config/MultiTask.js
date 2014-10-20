/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'MultiTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

    /**
     * Creates a MultiTask instance.
     * MultiTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name grocer.MultiTask.create
     * @function
     * @param {string} taskName Name of multi task.
     * @param {object} [taskNode]
     * @returns {grocer.MultiTask}
     */

    /**
     * The MultiTask implements a 'multi' grunt task.
     * Multi grunt tasks are loaded via plugins and are configurable.
     * @class
     * @extends grocer.GruntTask
     * @see http://gruntjs.com/creating-tasks#multi-tasks
     */
    grocer.MultiTask = self
        .addMethods(/** @lends grocer.MultiTask# */{
            /**
             * @param {string} taskName
             * @param {object} [configNode]
             * @ignore
             */
            init: function (taskName, configNode) {
                dessert.isObjectOptional(configNode, "Invalid task config node");

                base.init.call(this, taskName);

                /**
                 * Grunt plugin associated with multi task.
                 * @type {grocer.GruntPlugin}
                 */
                this.gruntPlugin = undefined;

                /**
                 * Collection of target configurations.
                 * Structure: target name - target config object.
                 * @type {sntls.Collection}
                 */
                this.targets = sntls.Collection.create(configNode);
            },

            /**
             * Applies task by either loading the plugin or registering it with the provided handler.
             * @param {string} [description]
             * @returns {grocer.MultiTask}
             */
            applyTask: function (description) {
                var gruntPlugin = this.gruntPlugin,
                    taskHandler = this.taskHandler;

                dessert.assert(!!gruntPlugin || !!taskHandler, "Task has no associated plugin or handler");

                if (gruntPlugin) {
                    gruntPlugin.loadPlugin();
                } else {
                    grocer.GruntProxy.create()
                        .registerMultiTask(this.taskName, description, this.taskHandler);
                }

                return this;
            },

            /**
             * Sets NPM package name for the plugin associated with the current task.
             * @param {string} packageName Name of NPM package for the plugin.
             * @returns {grocer.MultiTask}
             */
            setPackageName: function (packageName) {
                dessert.isString(packageName, "Invalid packahe name");
                this.gruntPlugin = packageName.toGruntPlugin();
                return this;
            },

            /**
             * Adds a target to the task.
             * @param {string} targetName Name of target, eg. 'development'.
             * @param {object} targetConfigNode
             * @returns {grocer.MultiTask}
             */
            addTarget: function (targetName, targetConfigNode) {
                this.targets.setItem(targetName, targetConfigNode);
                return this;
            },

            /**
             * Tells whether the task has the specified target.
             * @param {string} targetName
             * @returns {boolean}
             */
            hasTarget: function (targetName) {
                return !!this.targets.getItem(targetName);
            },

            /**
             * Fetches config node for the whole task, with each target prefixed optionally.
             * @param {string} [targetPrefix] Optional prefix for targets.
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                dessert.isStringOptional(targetPrefix, "Invalid target prefix");

                if (targetPrefix) {
                    return this.targets
                        .mapKeys(function (targetConfig, targetName) {
                            return targetPrefix + targetName;
                        })
                        .items;
                } else {
                    return this.targets.items;
                }
            },

            /**
             * Adds task to the specified GruntConfig instance.
             * @param {grocer.GruntConfig} config Config to add the task to.
             * @returns {grocer.MultiTask}
             */
            addToConfig: function (config) {
                dessert.isGruntConfig(config, "Invalid grunt config");
                config.addMultiTask(this);
                return this;
            },

            /**
             * Adds current multi task to a collection of multi tasks.
             * @param {grocer.MultiTaskCollection} multiTaskCollection Collection to add the task to.
             * @returns {grocer.MultiTask}
             */
            addToCollection: function (multiTaskCollection) {
                dessert.isMultiTaskCollection(multiTaskCollection, "Invalid multi task collection");
                multiTaskCollection.setItem(this.taskName, this);
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
             * Converts string to MultiTask, treating the string as the plugin name.
             * @param {object} [configNode] Optional task config.
             * @returns {grocer.MultiTask}
             */
            toMultiTask: function (configNode) {
                return grocer.MultiTask.create(this.valueOf(), configNode);
            }
        },
        false, false, false
    );

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.MultiTask} expr */
        isMultiTask: function (expr) {
            return grocer.MultiTask.isBaseOf(expr);
        },

        /** @param {grocer.MultiTask} expr */
        isMultiTaskOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.MultiTask.isBaseOf(expr);
        }
    });
}());
