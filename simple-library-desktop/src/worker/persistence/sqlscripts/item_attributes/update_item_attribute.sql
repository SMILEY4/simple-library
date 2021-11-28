-- itemId (number): the id of the item
-- attId (number): the (unique) id of the attribute
-- value (string): the new value of the attribute
UPDATE item_attributes
SET value    = $value,
	modified = 1
WHERE item_id = $itemId
  AND att_id = $attId;