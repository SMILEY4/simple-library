-- itemId (number): the id of the item
SELECT key, value, type, modified
FROM item_attributes
WHERE  item_id = $itemId;