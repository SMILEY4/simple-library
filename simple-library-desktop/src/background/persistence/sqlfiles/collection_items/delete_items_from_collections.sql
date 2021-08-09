-- itemIds (csv-numbers): the ids of the items to delete
DELETE
FROM collection_items
WHERE item_id IN ( $itemIds );