-- itemId (number): the id of the item
SELECT attribute_meta.id        as id,
	   attribute_meta.name      as name,
	   attribute_meta.g0        as g0,
	   attribute_meta.g1        as g1,
	   attribute_meta.g2        as g2,
	   attribute_meta.type      as type,
	   attribute_meta.writable  as writable,
	   item_attributes.value    as value,
	   item_attributes.modified as modified
FROM attribute_meta,
	 item_attributes
		 LEFT JOIN hidden_attributes hidden ON item_attributes.id = hidden.id
		 AND item_attributes.name = hidden.name
		 AND item_attributes.g0 = hidden.g0
		 AND item_attributes.g1 = hidden.g1
		 AND item_attributes.g2 = hidden.g2
WHERE item_id = $itemId
  AND hidden.id IS NULL
  AND item_attributes.id = attribute_meta.id
  AND item_attributes.name = attribute_meta.name
  AND item_attributes.g0 = attribute_meta.g0
  AND item_attributes.g1 = attribute_meta.g1
  AND item_attributes.g2 = attribute_meta.g2