-- collectionId (number): the id of the collection to remove the items from
-- itemIds (csv-string): the ids of the items to remove
DELETE
FROM collection_items
WHERE collection_id = $collectionId
  AND item_id IN ( $itemIds );
