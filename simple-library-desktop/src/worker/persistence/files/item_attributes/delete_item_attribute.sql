-- itemId (number): the id of the item
-- key (string): the key of the attribute
DELETE
FROM item_attributes
WHERE key = $key AND item_id = $itemId;