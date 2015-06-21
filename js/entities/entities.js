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
            'bookworm': {
                parent: 'rubberband',
                assets: {
                    js: ['node_modules/bookworm/bookworm.js']
                }
            },

            'dessert': {
                assets: {
                    js: ['node_modules/dessert/dessert.js']
                }
            },

            'evan': {
                parent: 'sntls',
                assets: {
                    js: ['node_modules/evan/evan.js']
                }
            },

            'rubberband': {
                parent: 'evan',
                assets: {
                    js: ['node_modules/rubberband/rubberband.js']
                }
            },

            'sntls': {
                parent: 'troop',
                assets: {
                    js: [
                        'node_modules/q/q.js',
                        'node_modules/sntls/sntls.js'
                    ]
                }
            },

            'troop': {
                parent: 'dessert',
                assets: {
                    js: ['node_modules/troop/troop.js']
                }
            }
            //            ,
            //
            //            /**
            //             * Alternative singular module definition for all framework libraries.
            //             */
            //            framework: {
            //                assets      : {
            //                    js: [
            //                        'node_modules/q/q.js',
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
