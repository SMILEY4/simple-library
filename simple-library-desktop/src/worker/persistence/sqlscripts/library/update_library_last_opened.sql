-- $timestamp_last_opened (number): the new "last-opened"-timestamp
UPDATE metadata
SET value = $newTimestamp
WHERE key = 'timestamp_last_opened';