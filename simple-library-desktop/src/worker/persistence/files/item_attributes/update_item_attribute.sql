-- itemId (number): the id of the item
-- key (string): the key of the attribute
-- value (string): the new value of the attribute
UPDATE item_attributes
SET value    = $value,
	modified = 1
WHERE key = $key
  AND item_id = $itemId
