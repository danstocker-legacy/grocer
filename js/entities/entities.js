/*global dessert, troop, sntls, evan, bookworm */
troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.entities
        .appendNode('document>module>framework>assets>js'.toPath(), [
            'node_modules/dessert/dessert.js',
            'node_modules/troop/troop.js',
            'node_modules/q/q.js',
            'node_modules/sntls/sntls.js',
            'node_modules/evan/evan.js',
            'node_modules/rubberband/rubberband.js',
            'node_modules/bookworm/bookworm.js'
        ]);
});
