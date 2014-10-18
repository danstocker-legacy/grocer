/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'MultiTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

    /**
     * @name grocer.MultiTask.create
     * @function
     * @param {string} taskName
     * @param {object} [taskNode]
     * @returns {grocer.MultiTask}
     */

    /**
     * @class
     * @extends grocer.GruntTask
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

                /** @type {sntls.Collection} */
                this.targets = sntls.Collection.create(configNode);
            },

            /** @returns {grocer.MultiTask} */
            applyTask: function () {
                this.taskName.toGruntPlugin()
                    .loadPlugin();
                return this;
            },

            /**
             * @param {string} targetName
             * @param {object} targetNode
             * @returns {grocer.MultiTask}
             */
            addTarget: function (targetName, targetNode) {
                this.targets.setItem(targetName, targetNode);
                return this;
            },

            /**
             * @param {string} targetName
             * @returns {boolean}
             */
            hasTarget: function (targetName) {
                return !!this.targets.getItem(targetName);
            },

            /**
             * @param {string} [targetPrefix]
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
             * @param {grocer.GruntConfig} config
             * @param {string} taskName
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
             * @param {grocer.MultiTaskCollection} multiTaskCollection
             * @param {string} taskName
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
             * @param {object} [configNode]
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
