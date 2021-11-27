-- modified (number, 0 or 1): the new value of the modified flag
-- itemId (number): the id of the item
-- attId (number): the (unique) id of the attribute
UPDATE item_attributes
SET modified = $modified
WHERE item_id = $itemId
  AND att_id = $attId