-- itemId (number): the id of the item
DELETE
FROM item_attributes
WHERE item_id = $itemId;
