CREATE TABLE collections
(
    collection_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_name TEXT NOT NULL,
    group_id        INTEGER
        CONSTRAINT fk_group_id
            REFERENCES groups
            ON DELETE CASCADE
);