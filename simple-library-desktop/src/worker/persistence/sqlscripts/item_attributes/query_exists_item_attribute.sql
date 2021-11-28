-- itemId (number): the id of the item
-- attId (number): the (unique) id of the attribute
SELECT count(*) as count
FROM item_attributes
WHERE item_id = $itemId
  AND att_id = $attId;
