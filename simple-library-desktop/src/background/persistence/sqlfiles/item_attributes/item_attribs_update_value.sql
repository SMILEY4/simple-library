UPDATE item_attributes
SET value = $value
WHERE key = $key AND item_id = $itemId
