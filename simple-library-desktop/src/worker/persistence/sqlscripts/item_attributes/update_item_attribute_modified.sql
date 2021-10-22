-- modified (number, 0 or 1): the new value of the modified flag
-- itemId (number): the id of the item
-- id (string): the id of the attribute
-- name (string): the name of the attribute
-- g0 (string): the g0 of the attribute
-- g1 (string): the g1 of the attribute
-- g2 (string): the g2 of the attribute
UPDATE item_attributes
SET modified = $modified
WHERE item_id = $itemId
  AND name = $name
  AND id = $id
  AND g0 = $g0
  AND g1 = $g1
  AND g2 = $g2