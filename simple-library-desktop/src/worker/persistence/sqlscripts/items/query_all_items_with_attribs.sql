-- attributeIds (csv-numbers): the (unique) ids of the attributes to fetch
SELECT items.*, group_concat(attribs.str_attribute, ';') AS csv_attributes
FROM items
		 LEFT JOIN (
			SELECT *,
				   '"'
					   || attribute_meta.att_id
					   || ':'
					   || attribute_meta.id
					   || ':'
					   || attribute_meta.name
					   || ':'
					   || attribute_meta.g0
					   || ':'
					   || attribute_meta.g1
					   || ':'
					   || attribute_meta.g2
					   || '-'
					   || attribute_meta.type
					   || '-'
					   || attribute_meta.writable
					   || '"="'
					   || item_attributes.value
					   || '"-"'
					   || item_attributes.modified
					   || '"'
					   AS str_attribute -- "attId:id:name:g0:g1:g2-type-writable"="myValue-1"
			FROM item_attributes,
				 attribute_meta
			WHERE item_attributes.att_id = attribute_meta.att_id
			  AND item_attributes.att_id IN ($attributeIds)
		) attribs ON items.item_id = attribs.item_id
GROUP BY items.item_id;