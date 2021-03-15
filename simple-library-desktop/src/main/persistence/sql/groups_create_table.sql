CREATE TABLE groups
(
    group_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    parent_group_id INTEGER
        CONSTRAINT fk_parent_group_id
            REFERENCES groups
            ON DELETE CASCADE
);