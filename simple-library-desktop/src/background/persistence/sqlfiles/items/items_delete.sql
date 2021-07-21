DELETE
FROM items
WHERE item_id IN ( $itemIds );