-- itemId (number): the id of the item
-- attId (number): the (unique) id of the attribute
SELECT item_attributes.value    as value,
	   item_attributes.modified as modified,
	   attribute_meta.att_id    as att_id,
	   attribute_meta.name      as name,
	   attribute_meta.id        as id,
	   attribute_meta.g0        as g0,
	   attribute_meta.g1        as g1,
	   attribute_meta.g2        as g2,
	   attribute_meta.type      as type,
	   attribute_meta.writable  as writable
FROM item_attributes,
	 attribute_meta
WHERE item_id = $itemId
  AND item_attributes.att_id = $attId
  AND item_attributes.att_id = attribute_meta.att_id;