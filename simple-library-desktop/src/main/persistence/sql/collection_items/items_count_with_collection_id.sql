SELECT COUNT(*) AS count
FROM collection_items
WHERE collection_items.collection_id = $collectionId;