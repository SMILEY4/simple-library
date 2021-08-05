-- collectionId (number): the id of the collection to update
-- collectionSmartQuery (string, null): the new smart-query
UPDATE collections
SET smart_query = $collectionSmartQuery
WHERE collection_id = $collectionId;
