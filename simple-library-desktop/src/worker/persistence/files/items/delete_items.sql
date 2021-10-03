-- itemIds (csv-numbers): the ids of the items to delete
DELETE
FROM items
WHERE item_id IN ( $itemIds );