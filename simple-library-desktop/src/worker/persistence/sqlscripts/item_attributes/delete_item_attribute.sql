-- itemId (number): the id of the item
-- attId (integer): the unique id of the attribute
DELETE
FROM item_attributes
WHERE item_id = $itemId
  AND att_id = $attId
  AND name = $name;
