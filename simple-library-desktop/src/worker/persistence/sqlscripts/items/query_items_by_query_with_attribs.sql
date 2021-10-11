-- attributeKeys (csv-strings): must be in the given format: "('id1','name1','g01','g11','g21'), ('id2','name2','g02','g12','g22'), ..."
-- query: the custom query / where-expression
SELECT items.*, group_concat(attribs.str_attribute, ';') AS csv_attributes
FROM items
		 LEFT JOIN (
	SELECT *,
		   '"'
			   || attribute_meta.id
			   || ':'
			   || attribute_meta.name
			   || ':'
			   || attribute_meta.g0
			   || ':'
			   || attribute_meta.g1
			   || ':'
			   || attribute_meta.g2
			   || '-'
			   || attribute_meta.type
			   || '"="'
			   || item_attributes.value
			   || '"-"'
			   || item_attributes.modified
			   || '"'
			   AS str_attribute -- "id:name:g0:g1:g2-type=myValue-1"
	FROM item_attributes,
		 attribute_meta
	WHERE item_attributes.id = attribute_meta.id
	  AND item_attributes.name = attribute_meta.name
	  AND item_attributes.g0 = attribute_meta.g0
	  AND item_attributes.g1 = attribute_meta.g1
	  AND item_attributes.g2 = attribute_meta.g2
	  AND (item_attributes.id, item_attributes.name, item_attributes.g0, item_attributes.g1, item_attributes.g2) IN
		  (VALUES $attributeKeys)
) attribs ON items.item_id = attribs.item_id
WHERE $query
GROUP BY items.item_id;
