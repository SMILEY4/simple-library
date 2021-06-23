DELETE
FROM collection_items
WHERE collection_id = $collectionId
  AND item_id IN ( $itemIds );