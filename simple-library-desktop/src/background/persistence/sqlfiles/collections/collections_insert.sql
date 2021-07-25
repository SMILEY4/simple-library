-- collectionName (string): the name of the collection
-- collectionType (string): the type of the collection
-- query (string, null): a custom query-string or null
-- groupId (number, null): the parent-group-id or null
INSERT INTO collections (collection_name, collection_type, smart_query, group_id)
VALUES ($collectionName, $collectionType, $query, $groupId);
