-- itemId (number): the id of the item
-- key (string): the key of the attribute
-- value (string): the new value of the attribute
UPDATE item_attributes
SET value = $value
WHERE key = $key AND item_id = $itemId
