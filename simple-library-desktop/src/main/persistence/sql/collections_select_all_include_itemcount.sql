SELECT collections.*, COUNT(collection_items.item_id) AS item_count
FROM collections
         LEFT JOIN collection_items ON collections.collection_id = collection_items.collection_id
GROUP BY collections.collection_id;