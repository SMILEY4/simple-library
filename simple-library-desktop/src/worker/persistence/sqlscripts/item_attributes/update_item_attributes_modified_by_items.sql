-- modified (number, 0 or 1): the new value of the modified flags
-- itemIds (csv-numbers): the ids of the items
UPDATE item_attributes
SET modified = $modified
WHERE item_id IN ($itemIds)