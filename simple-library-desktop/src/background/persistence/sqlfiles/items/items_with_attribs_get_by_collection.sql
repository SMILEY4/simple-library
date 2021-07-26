-- collectionId (number): the id of the collection
-- attributeKeys (csv-strings): the keys of the attributes to fetch in the format: "key1", "key2", "key3", ...
SELECT items.*, group_concat(attribs.attr_key_value, ';') AS attributes
FROM collection_items,
     items
         LEFT JOIN (
         SELECT *, '"' || key || '"="' || value || '"-"' || type || '"' AS attr_key_value
         FROM item_attributes
         WHERE key IN ($attributeKeys)
     ) attribs ON items.item_id = attribs.item_id
WHERE items.item_id = collection_items.item_id
  AND collection_items.collection_id = $collectionId
GROUP BY items.item_id;
