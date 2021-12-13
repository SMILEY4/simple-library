-- itemId (number): the id of the item
SELECT attribute_meta.att_id     as att_id,
	   attribute_meta.id        as id,
	   attribute_meta.name      as name,
	   attribute_meta.g0        as g0,
	   attribute_meta.g1        as g1,
	   attribute_meta.g2        as g2,
	   attribute_meta.type      as type,
	   attribute_meta.writable  as writable,
       attribute_meta.custom    as custom,
	   item_attributes.value    as value,
	   item_attributes.modified as modified
FROM attribute_meta,
	 item_attributes
		 LEFT JOIN hidden_attributes hidden ON item_attributes.att_id = hidden.att_id
WHERE item_id = $itemId
  AND hidden.att_id IS NULL
  AND item_attributes.att_id = attribute_meta.att_id
