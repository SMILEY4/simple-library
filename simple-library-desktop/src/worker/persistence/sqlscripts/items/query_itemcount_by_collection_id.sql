-- collectionId: the id of the (normal) collection
SELECT COUNT(*) AS count
FROM collection_items
WHERE collection_items.collection_id = $collectionId;