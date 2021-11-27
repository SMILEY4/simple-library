-- attIds (cs-integers): the (unique) attribute ids
SELECT *
FROM attribute_meta
WHERE attribute_meta.attId IN ($attIds);