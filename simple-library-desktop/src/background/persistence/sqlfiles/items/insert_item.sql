-- filepath (string): the filepath to the original file
-- timestamp (number): the timestamp when this item was inserted
-- hash (string): the hash of the original file
-- thumbnail (string): the thumbnail
INSERT INTO items
(filepath,
 timestamp_imported,
 hash,
 thumbnail)
VALUES ($filepath,
		$timestamp,
		$hash,
		$thumbnail);