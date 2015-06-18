/*global dessert, troop, sntls, evan, bookworm */
troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.entities
        .appendNode('document>module'.toPath(), {
        });
});
