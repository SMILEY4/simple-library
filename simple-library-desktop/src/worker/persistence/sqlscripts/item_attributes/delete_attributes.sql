-- attributeIds (csv-number): the ids of the attributes to delete from all items
DELETE
FROM item_attributes
WHERE item_attributes.att_id IN ($attributeIds);
