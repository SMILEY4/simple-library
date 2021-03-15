create table collection_items
(
    collection_id INTEGER NOT NULL
        CONSTRAINT fk_collection_id
            REFERENCES collections
            ON DELETE CASCADE,
    item_id       INTEGER NOT NULL
        CONSTRAINT fk_item_id
            REFERENCES items
            ON DELETE CASCADE,
    PRIMARY KEY (collection_id, item_id)
);