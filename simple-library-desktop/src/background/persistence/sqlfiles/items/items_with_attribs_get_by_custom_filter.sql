-- attributeKeys (csv-strings): the keys of the attributes to fetch in the format: "key1", "key2", "key3", ...
-- query: the custom query / where-expression
SELECT items.*, group_concat(attribs.attr_key_value, ';') AS attributes
FROM items
         LEFT JOIN (
			SELECT key, value, type, item_id AS attr_item_id, '"' || key || '"="' || value || '"-"' || type || '"' AS attr_key_value
            FROM item_attributes
            WHERE key IN ($attributeKeys)
        ) attribs ON items.item_id = attribs.attr_item_id
WHERE $query
GROUP BY items.item_id;
