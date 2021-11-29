SELECT default_attribute_values.att_id         as att_id,
	   default_attribute_values.value          as value,
	   default_attribute_values.allowOverwrite as allowOverwrite,
	   attribute_meta.id                       as id,
	   attribute_meta.name                     as name,
	   attribute_meta.g0                       as g0,
	   attribute_meta.g1                       as g1,
	   attribute_meta.g2                       as g2,
	   attribute_meta.type                     as type,
	   attribute_meta.writable                 as writable
FROM default_attribute_values,
	 attribute_meta
WHERE default_attribute_values.att_id = attribute_meta.att_id