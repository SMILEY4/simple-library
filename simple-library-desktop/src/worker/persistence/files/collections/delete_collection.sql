-- collectionId (number): the id of the collection to dele
DELETE
FROM collections
WHERE collection_id = $collectionId;
