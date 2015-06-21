/*global dessert, troop, sntls, evan, bookworm */
troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.config
        .appendNode('document>document>field'.toPath(), {
            'module/assets': 'collection',
            'module/symbol': 'string',
            'module/parent': 'string'
        });
});
