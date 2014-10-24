/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntProxy', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates or retrieves a GruntProxy instance.
     * @name grocer.GruntProxy.create
     * @function
     * @returns {grocer.GruntProxy}
     */

    /**
     * The GruntProxy singleton provides a testable API to communicate with grunt.
     * @class
     * @extends troop.Base
     */
    grocer.GruntProxy = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends grocer.GruntProxy# */{
            /** @ignore */
            init: function () {
                /**
                 * Reference to the grunt object.
                 * @type {object}
                 */
                this.grunt = undefined;
            },

            /**
             * Sets grunt object. This must be called at least once in order to use
             * the config management part of grocer.
             * @param {object} grunt
             * @returns {grocer.GruntProxy}
             */
            setGruntObject: function (grunt) {
                dessert.isObject(grunt, "Invalid grunt object");
                this.grunt = grunt;
                return this;
            },

            /**
             * Proxy for grunt.config.init().
             * @param {object} config Config object to be passed to grunt.
             * @returns {*}
             */
            configInit: function (config) {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.config.init(config);
            },

            /**
             * Proxy for grunt.config.merge().
             * @param {object} config Config object to be passed to grunt.
             * @returns {*}
             */
            configMerge: function (config) {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.config.merge(config);
            },

            /**
             * Proxy for grunt.config.set().
             * @param {string} propertyName
             * @param {*} config
             * @returns {*}
             */
            configSet: function (propertyName, config) {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.config.set(propertyName, config);
            },

            /**
             * @param {string} propertyName
             * @returns {string}
             */
            configEscape: function (propertyName) {
                return this.grunt.config.escape(propertyName);
            },

            /**
             * Proxy for grunt.registerTask().
             * @returns {*}
             */
            registerTask: function () {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.registerTask.apply(this.grunt, arguments);
            },

            /**
             * Proxy for grunt.registerMultiTask().
             * @returns {*}
             */
            registerMultiTask: function () {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.registerMultiTask.apply(this.grunt, arguments);
            },

            /**
             * Proxy for grunt.loadTasks().
             * returns {*}
             */
            loadTasks: function () {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.loadTasks.apply(this.grunt, arguments);
            },

            /**
             * Proxy for grunt.loadNpmTasks().
             * returns {*}
             */
            loadNpmTasks: function () {
                dessert.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.loadNpmTasks.apply(this.grunt, arguments);
            }
        });
});
