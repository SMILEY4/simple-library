-- modified (number, 0 or 1): the new value of the modified flags
UPDATE item_attributes
SET modified = $modified
WHERE modified <> $modified