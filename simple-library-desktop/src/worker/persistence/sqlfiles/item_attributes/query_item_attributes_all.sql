SELECT item_attributes.*, items.filepath
FROM item_attributes,
	 items
WHERE item_attributes.item_id = items.item_id
ORDER BY item_id;