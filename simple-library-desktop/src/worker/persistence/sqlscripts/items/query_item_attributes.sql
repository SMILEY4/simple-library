-- itemId (number): the id of the item
SELECT attribute_meta.id        as id,
	   attribute_meta.name      as name,
	   attribute_meta.g0        as g0,
	   attribute_meta.g1        as g1,
	   attribute_meta.g2        as g2,
	   attribute_meta.type      as type,
	   attribute_meta.writable  as writeable,
	   item_attributes.value    as value,
	   item_attributes.modified as modified
FROM item_attributes,
	 attribute_meta
WHERE item_id = $itemId
  AND item_attributes.id = attribute_meta.id
  AND item_attributes.name = attribute_meta.name
  AND item_attributes.g0 = attribute_meta.g0
  AND item_attributes.g1 = attribute_meta.g1
  AND item_attributes.g2 = attribute_meta.g2