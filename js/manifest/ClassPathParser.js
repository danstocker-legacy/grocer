/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'ClassPathParser', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The ClassPathParser has the sole purpose of parsing class path string expressions.
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
        .addMethods(/** @lends grocer.ClassPathParser */{
            /**
             * Parses class path. The class path is a path delimited by any character that is
             * not word character, numeric, underscore, or dollar sign.
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
             * Converts string to Path, treating the string as class path.
             * @returns {sntls.Path}
             */
            toPathFromClassPath: function () {
                return grocer.ClassPathParser.parseClassPath(this);
            }
        },
        false, false, false
    );
}());
