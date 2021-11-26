-- id (string): the id of the attribute (not unique by itself)
-- name (string): the key of the attribute
-- g0 (string): the identifier of group 0 of the attribute
-- g1 (string): the identifier of group 1 of the attribute
-- g2 (string): the identifier of group 2 of the attribute
DELETE
FROM hidden_attributes
WHERE id = $id
  AND name = $name
  AND g0 = $g0
  AND g1 = $g1
  AND g2 = $g2;
