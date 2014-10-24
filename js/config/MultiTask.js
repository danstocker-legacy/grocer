/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'MultiTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend(),
        validators = dessert.validators;

    /**
     * Creates a MultiTask instance.
     * MultiTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name grocer.MultiTask.create
     * @function
     * @param {string} taskName Name of multi task.
     * @param {object|function} [configNode]
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
        .addPrivateMethods(/** @lends grocer.MultiTask# */{
            /**
             * @returns {object}
             * @private
             */
            _getConfigNode: function () {
                return typeof this.configNode === 'function' ?
                       this.configNode() :
                       this.configNode;
            }
        })
        .addMethods(/** @lends grocer.MultiTask# */{
            /**
             * @param {string} taskName
             * @param {object|function} [configNode]
             * @ignore
             */
            init: function (taskName, configNode) {
                dessert.assert(
                    !configNode || validators.isFunction(configNode) || validators.isObject(configNode),
                    "Invalid task config node");

                base.init.call(this, taskName);

                /**
                 * Grunt plugin associated with multi task.
                 * @type {grocer.GruntPlugin}
                 */
                this.gruntPlugin = undefined;

                /**
                 * Relative path to file that implements the task.
                 * @type {string}
                 */
                this.taskPath = undefined;

                /**
                 * Config node object or function that generates it.
                 * @type {object|function}
                 */
                this.configNode = configNode || {};
            },

            /**
             * Applies task by either loading the plugin or registering it with the provided handler.
             * @param {string} [description]
             * @returns {grocer.MultiTask}
             */
            applyTask: function (description) {
                var gruntPlugin = this.gruntPlugin,
                    taskPath = this.taskPath,
                    taskHandler = this.taskHandler;

                dessert.assert(!!gruntPlugin || !!taskPath || !!taskHandler,
                    "Task has no associated plugin, path, or handler");

                if (gruntPlugin) {
                    gruntPlugin.loadPlugin();
                } else if (taskPath) {
                    grocer.GruntProxy.create()
                        .loadTasks(taskPath);
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
             * Sets task path, so that it can be loaded from an external javascript file.
             * Overwrites previously set task path.
             * @param {string} taskPath
             * @returns {grocer.MultiTask}
             */
            setTaskPath: function (taskPath) {
                dessert.isString(taskPath, "Invalid task path");
                this.taskPath = taskPath;
                return this;
            },

            /**
             * Fetches config node for the whole task, with each target prefixed optionally.
             * @param {string} [targetPrefix] Optional prefix for targets.
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                dessert.isStringOptional(targetPrefix, "Invalid target prefix");

                var configNode = this._getConfigNode();

                if (targetPrefix) {
                    return sntls.Collection.create(configNode)
                        .mapKeys(function (targetConfig, targetName) {
                            return targetPrefix + targetName;
                        })
                        .items;
                } else {
                    return configNode;
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
