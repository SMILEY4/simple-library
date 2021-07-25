-- collectionId (number): the id of the collection to update
-- groupId (number, null): the id of the new parent-group
UPDATE collections
SET group_id = $groupId
WHERE collection_id = $collectionId;
