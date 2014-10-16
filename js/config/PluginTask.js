/*global dessert, troop, sntls, evan, shoeshine, grocer */
troop.postpone(grocer, 'PluginTask', function () {
    "use strict";

    var base = grocer.GruntTask,
        self = base.extend();

    /**
     * @name grocer.PluginTask.create
     * @function
     * @param {string} taskName
     * @param {object} [taskNode]
     * @returns {grocer.PluginTask}
     */

    /**
     * @class
     * @extends grocer.GruntTask
     */
    grocer.PluginTask = self
        .addMethods(/** @lends grocer.PluginTask# */{
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

            /** @returns {grocer.PluginTask} */
            registerTask: function () {
                this.taskName.toGruntPlugin()
                    .loadPlugin();
                return this;
            },

            /**
             * @param {string} targetName
             * @param {object} targetNode
             * @returns {grocer.PluginTask}
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
             * @param {string} taskName
             * @param {grocer.GruntConfig} config
             * @returns {grocer.PluginTask}
             */
            addToConfig: function (taskName, config) {
                dessert
                    .isString(taskName, "Invalid task name")
                    .isGruntConfig(config, "Invalid grunt config");

                config.addTask(taskName, this);

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
             * @returns {grocer.PluginTask}
             */
            toPluginTask: function (configNode) {
                return grocer.PluginTask.create(this.valueOf(), configNode);
            }
        },
        false, false, false
    );

    dessert.addTypes(/** @lends dessert */{
        /** @param {grocer.PluginTask} expr */
        isPluginTask: function (expr) {
            return grocer.PluginTask.isBaseOf(expr);
        },

        /** @param {grocer.PluginTask} expr */
        isPluginTaskOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   grocer.PluginTask.isBaseOf(expr);
        }
    });
}());
