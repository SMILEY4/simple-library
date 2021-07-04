CREATE TABLE item_attributes
(
    key     TEXT    NOT NULL,
    value   TEXT    NOT NULL,
    type    TEXT    NOT NULL,
    item_id INTEGER NOT NULL
        CONSTRAINT fk_item_id
            REFERENCES items
            ON DELETE CASCADE,
    PRIMARY KEY (key, item_id)
);
