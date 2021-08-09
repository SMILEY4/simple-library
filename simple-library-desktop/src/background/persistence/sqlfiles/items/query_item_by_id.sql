-- itemId (number): the id of the item to fetch
SELECT *
FROM items
WHERE item_id = $itemId;
