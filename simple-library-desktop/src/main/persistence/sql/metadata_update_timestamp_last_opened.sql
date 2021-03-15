UPDATE metadata
SET value = $newTimestamp
WHERE key = 'timestamp_last_opened';