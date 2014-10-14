/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'ClassPathParser', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     */
    grocer.ClassPathParser = self
        .addConstants(/** @lends grocer.ClassPathParser */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_CLASS_PATH_DELIMITER: /[^0-9a-z_$]+/i
        })
        .addMethods(/** @lends grocer.ClassPathParser# */{
            /**
             * @param {string} classPath
             * @returns {sntls.Path}
             */
            parseClassPath: function (classPath) {
                return classPath.split(this.RE_CLASS_PATH_DELIMITER).toPath();
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {sntls.Path}
             */
            toPathFromClassPath: function () {
                return grocer.ClassPathParser.parseClassPath(this);
            }
        },
        false, false, false
    );
}());
