--filter: a filter-string
SELECT DISTINCT id, g0, g1, g2, name
FROM attribute_meta
WHERE name LIKE '%$filter%'
ORDER BY name = '$filter' DESC, name LIKE '%$filter%' DESC;