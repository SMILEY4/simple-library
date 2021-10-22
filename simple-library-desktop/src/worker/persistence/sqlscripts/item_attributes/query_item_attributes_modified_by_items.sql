-- itemIds (csv-numbers): the ids of the items to fetch the attributes for
SELECT attribute_meta.id       as id,
	   attribute_meta.name     as name,
	   attribute_meta.g0       as g0,
	   attribute_meta.g1       as g1,
	   attribute_meta.g2       as g2,
	   attribute_meta.type     as type,
	   attribute_meta.writable as writable,
	   item_attributes.value   as value,
	   item_attributes.item_id as item_id,
	   items.filepath          as filepath
FROM item_attributes,
	 attribute_meta,
	 items
WHERE item_attributes.id = attribute_meta.id
  AND item_attributes.name = attribute_meta.name
  AND item_attributes.g0 = attribute_meta.g0
  AND item_attributes.g1 = attribute_meta.g1
  AND item_attributes.g2 = attribute_meta.g2
  AND items.item_id = item_attributes.item_id
  AND attribute_meta.writable = 1
  AND modified = 1
  AND item_attributes.item_id IN ($itemIds)
ORDER BY item_id;