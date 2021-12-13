-- attributeId (number): the id of the attribute
-- value (string): the value to of the attribute
INSERT INTO item_attributes (att_id, item_id, value, modified)
SELECT DISTINCT $attributeId as att_id, items.item_id, $value as value, 0 as modified
FROM items
         LEFT JOIN (
    SELECT *
    FROM item_attributes
    WHERE item_attributes.att_id = $attributeId
) ia on items.item_id = ia.item_id
WHERE att_id IS NULL;
