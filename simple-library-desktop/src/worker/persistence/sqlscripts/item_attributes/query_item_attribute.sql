-- itemId (number): the id of the item
-- id (string): the id of the attribute (not unique by itself)
-- name (string): the name of the attribute
-- g0 (string): the identifier of group 0 of the attribute
-- g1 (string): the identifier of group 1 of the attribute
-- g2 (string): the identifier of group 2 of the attribute
SELECT item_attributes.*, attribute_meta.type, attribute_meta.writable
FROM item_attributes,
	 attribute_meta
WHERE item_id = $itemId
  AND item_attributes.id = $id
  AND item_attributes.name = $name
  AND item_attributes.g0 = $g0
  AND item_attributes.g1 = $g1
  AND item_attributes.g2 = $g2
  AND item_attributes.id = attribute_meta.id
  AND item_attributes.name = attribute_meta.name
  AND item_attributes.g0 = attribute_meta.g0
  AND item_attributes.g1 = attribute_meta.g1
  AND item_attributes.g2 = attribute_meta.g2
