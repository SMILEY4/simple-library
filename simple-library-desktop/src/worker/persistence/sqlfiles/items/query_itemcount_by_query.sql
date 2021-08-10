-- $query: a custom where-condition
SELECT COUNT(*) AS count
FROM items
WHERE $query;