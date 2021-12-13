-- attIds (csv-number): the ids of the attributes
DELETE
FROM attribute_meta
WHERE att_id IN ($attIds);
