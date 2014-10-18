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
             * @param {string} pluginName
             * @param {object} [configNode]
             * @ignore
             */
            init: function (pluginName, configNode) {
                dessert.isObjectOptional(configNode, "Invalid task config node");

                base.init.call(this, pluginName);

                /**
                 * Collection of target configurations.
                 * Structure: target name - target config object.
                 * @type {sntls.Collection}
                 */
                this.targets = sntls.Collection.create(configNode);
            },

            /**
             * Applies task by loading the plugin via the grunt API.
             * @returns {grocer.MultiTask}
             */
            applyTask: function () {
                this.taskName.toGruntPlugin()
                    .loadPlugin();
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
             * TODO: Refactor taskName vs. pluginName.
             * @param {grocer.GruntConfig} config Config to add the task to.
             * @param {string} taskName Name of task in the context of the config.
             * @returns {grocer.MultiTask}
             */
            addToConfig: function (config, taskName) {
                dessert
                    .isGruntConfig(config, "Invalid grunt config")
                    .isString(taskName, "Invalid task name");

                config.addTask(taskName, this);

                return this;
            },

            /**
             * Adds current multi task to a collection of multi tasks.
             * @param {grocer.MultiTaskCollection} multiTaskCollection Collection to add the task to.
             * @param {string} taskName Name of task in the context of the collection.
             * @returns {grocer.MultiTask}
             */
            addToCollection: function (multiTaskCollection, taskName) {
                dessert
                    .isMultiTaskCollection(multiTaskCollection, "Invalid multi task collection")
                    .isString(taskName, "Invalid task name");
                multiTaskCollection.setItem(taskName, this);
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
