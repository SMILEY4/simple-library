-- itemId (number): the id of the item
-- attId (number): the (unique) id of the attribute
SELECT item_attributes.*, attribute_meta.type, attribute_meta.writable
FROM item_attributes,
	 attribute_meta
WHERE item_id = $itemId
  AND item_attributes.att_id = $attId
  AND item_attributes.att_id = attribute_meta.attId;