CREATE TABLE items
(
    item_id            INTEGER PRIMARY KEY AUTOINCREMENT,
    filepath           TEXT    NOT NULL,
    timestamp_imported INTEGER NOT NULL,
    hash               TEXT    NOT NULL,
    thumbnail          TEXT    NOT NULL
);