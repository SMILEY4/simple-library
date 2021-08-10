-- itemIds (csv-numbers): the ids of the items to fetch
SELECT *
FROM items
WHERE items.item_id IN ( $itemIds );
