/*global dessert, troop, sntls, evan, bookworm */
troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    /**
     * Adding module setup.
     * By default, each dependency acts as a module, so that the dependency tree is more granular
     * and the application only loads what's necessary.
     * In certain cases it might make sense to pack all dependencies into a single module.
     */
    bookworm.entities
        .appendNode('document>module'.toPath(), {
            'thirdParty': {
                js: ['node_modules/q/q.js']
            },

            'bookworm': {
                dependencies: ['dessert', 'evan', 'rubberband', 'sntls', 'troop'],
                assets      : {
                    js: ['node_modules/bookworm/bookworm.js']
                }
            },

            'dessert': {
                assets: {
                    js: ['node_modules/dessert/dessert.js']
                }
            },

            'evan': {
                dependencies: ['dessert', 'sntls', 'troop'],
                assets      : {
                    js: ['node_modules/evan/evan.js']
                }
            },

            'rubberband': {
                dependencies: ['dessert', 'evan', 'thirdParty', 'sntls', 'troop'],
                assets      : {
                    js: ['node_modules/rubberband/rubberband.js']
                }
            },

            'sntls': {
                dependencies: ['dessert', 'troop'],
                assets      : {
                    js: ['node_modules/sntls/sntls.js']
                }
            },

            'troop': {
                dependencies: ['dessert'],
                assets      : {
                    js: ['node_modules/troop/troop.js']
                }
            }
            //            ,
            //
            //            /**
            //             * Alternative singular module definition for all framework libraries.
            //             */
            //            framework: {
            //                dependencies: ['thirdParty'],
            //                assets      : {
            //                    js: [
            //                        'node_modules/bookworm/bookworm.js',
            //                        'node_modules/dessert/dessert.js',
            //                        'node_modules/evan/evan.js',
            //                        'node_modules/rubberband/rubberband.js',
            //                        'node_modules/sntls/sntls.js',
            //                        'node_modules/troop/troop.js'
            //                    ]
            //                }
            //            }
        });
});
