/*global dessert, troop, sntls, evan, grocer */
troop.postpone(grocer, 'GruntProxy', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name grocer.GruntProxy.create
     * @function
     * @returns {grocer.GruntProxy}
     */

    /**
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
                /** @type {object} */
                this.grunt = undefined;
            },

            /**
             * @param {object} grunt
             * @returns {grocer.GruntProxy}
             */
            setGruntObject: function (grunt) {
                dessert.isObject(grunt, "Invalid grunt object");
                this.grunt = grunt;
                return this;
            },

            /**
             * @param {object} config
             * @returns {*}
             */
            initConfig: function (config) {
                return this.grunt.initConfig(config);
            },

            /** @returns {*} */
            registerTask: function () {
                return this.grunt.registerTask.apply(this.grunt, arguments);
            }
        });
});
