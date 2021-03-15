CREATE TABLE collection_items
(
    collection_id INTEGER NOT NULL,
    item_id       INTEGER NOT NULL,
    PRIMARY KEY (collection_id, item_id)
);