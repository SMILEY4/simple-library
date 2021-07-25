-- collectionId (number): the id of the collection to update
-- collectionName (string): the new name
UPDATE collections
SET collection_name = $collectionName
WHERE collection_id = $collectionId;
