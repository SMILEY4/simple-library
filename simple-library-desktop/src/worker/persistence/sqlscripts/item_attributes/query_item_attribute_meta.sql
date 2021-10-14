-- keys: the attribute keys in the following format "(id1, name1, g01, g11, g21), (id2, name2, g02, g12, g22), ..."
SELECT *
FROM attribute_meta
WHERE (id, name, g0, g1, g2) IN (VALUES $keys);