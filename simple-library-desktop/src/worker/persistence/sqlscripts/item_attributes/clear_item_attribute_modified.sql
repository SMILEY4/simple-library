-- itemId (number): the id of the item
-- key (string): the key of the attribute
UPDATE item_attributes
SET modified = 0
WHERE name = $key
  AND item_id = $itemId
