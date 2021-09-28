-- $name (string): the name of the library
-- $timestamp (number): the current timestamp (for creation, lastOpened)

CREATE TABLE metadata
(
	key   TEXT NOT NULL,
	value TEXT,
	PRIMARY KEY (key, value)
);

CREATE TABLE items
(
	item_id            INTEGER PRIMARY KEY AUTOINCREMENT,
	filepath           TEXT    NOT NULL,
	timestamp_imported INTEGER NOT NULL,
	hash               TEXT    NOT NULL,
	thumbnail          TEXT    NOT NULL
);

CREATE TABLE item_attributes
(
	key      TEXT    NOT NULL,
	value    TEXT    NOT NULL,
	type     TEXT    NOT NULL,
	modified BOOLEAN,
	item_id  INTEGER NOT NULL
		CONSTRAINT fk_item_id
			REFERENCES items
			ON DELETE CASCADE,
	CHECK (modified IN (0, 1)),
	PRIMARY KEY (key, item_id)
);

CREATE TABLE collections
(
	collection_id   INTEGER PRIMARY KEY AUTOINCREMENT,
	collection_name TEXT NOT NULL,
	collection_type TEXT NOT NULL,
	smart_query     TEXT,
	group_id        INTEGER
		CONSTRAINT fk_group_id
			REFERENCES groups
			ON DELETE CASCADE
);

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

CREATE TABLE groups
(
	group_id        INTEGER PRIMARY KEY AUTOINCREMENT,
	name            TEXT NOT NULL,
	parent_group_id INTEGER
		CONSTRAINT fk_parent_group_id
			REFERENCES groups
			ON DELETE CASCADE
);


INSERT INTO metadata
VALUES ('library_name', $name);

INSERT INTO metadata
VALUES ('timestamp_created', $timestamp);

INSERT INTO metadata
VALUES ('timestamp_last_opened', $timestamp);