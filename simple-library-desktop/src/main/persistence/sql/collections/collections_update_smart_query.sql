UPDATE collections
SET smart_query = $collectionSmartQuery
WHERE collection_id = $collectionId;