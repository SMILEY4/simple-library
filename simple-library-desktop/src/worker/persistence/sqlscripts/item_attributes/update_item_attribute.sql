-- itemId (number): the id of the item
-- attId (number): the (unique) id of the attribute
-- value (string): the new value of the attribute
-- modified (boolean): whether the modified flag is set
UPDATE item_attributes
SET value    = $value,
	modified = $modified
WHERE item_id = $itemId
  AND att_id = $attId;
