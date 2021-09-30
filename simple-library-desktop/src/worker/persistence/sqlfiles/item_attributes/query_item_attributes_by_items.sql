-- itemIds (csv-numbers): the ids of the items to fetch the attributes for
SELECT item_attributes.*, items.filepath
FROM item_attributes,
	 items
WHERE item_attributes.item_id = items.item_id
  AND item_attributes.item_id IN ($itemIds)
ORDER BY item_id;