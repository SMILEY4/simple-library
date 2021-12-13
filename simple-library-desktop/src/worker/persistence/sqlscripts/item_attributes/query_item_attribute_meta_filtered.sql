--filter: a filter-string
SELECT DISTINCT att_id, id, g0, g1, g2, name, type, writable, custom
FROM attribute_meta
WHERE name LIKE '%$filter%'
ORDER BY name = '$filter' DESC, name LIKE '%$filter%' DESC;
