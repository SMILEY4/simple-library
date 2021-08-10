SELECT items.*
FROM items,
     collection_items
WHERE items.item_id = collection_items.item_id
  AND collection_items.collection_id = $collectionId;