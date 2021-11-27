SELECT hidden_attributes.att_id as att_id,
	   attribute_meta.id        as id,
	   attribute_meta.name      as name,
	   attribute_meta.g0        as g0,
	   attribute_meta.g1        as g1,
	   attribute_meta.g2        as g2,
	   attribute_meta.type      as type,
	   attribute_meta.writable  as writable
FROM hidden_attributes,
	 attribute_meta
WHERE hidden_attributes.att_id = attribute_meta.att_id
ORDER BY attribute_meta.name