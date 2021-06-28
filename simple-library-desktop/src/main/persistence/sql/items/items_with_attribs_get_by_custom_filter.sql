SELECT items.*, group_concat(attribs.attr_key_value, ';') AS attributes
FROM items
         LEFT JOIN (
            SELECT *, '"' || key || '"="' || value || '"-"' || type || '"' AS attr_key_value
            FROM item_attributes
            WHERE key IN ($attributeKeys)
        ) attribs ON items.item_id = attribs.item_id
WHERE $query
GROUP BY items.item_id;