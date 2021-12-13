-- attributeIds (csv-numbers): the ids of the attributes to delete
DELETE FROM default_attribute_values
WHERE default_attribute_values.att_id IN ($attributeIds);
