-- attributeIds (csv-numbers): the (unique) ids of the attributes to fetch
-- pageIndex (integer): the index for pagination
-- pageSize (integer): the size of a page for pagination
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
					   || '-'
                       || attribute_meta.custom
                       || '-'
					   || item_list_attributes.att_index
					   || '"="'
					   || item_attributes.value
					   || '"-"'
					   || item_attributes.modified
					   || '"'
					   AS str_attribute -- "attId:id:name:g0:g1:g2-type-writable-custom-attIndex"="myValue-1"
			FROM item_attributes LEFT JOIN item_list_attributes ON item_list_attributes.att_id = item_attributes.att_id,
				 attribute_meta
			WHERE item_attributes.att_id = attribute_meta.att_id
			  AND item_attributes.att_id IN ($attributeIds)
		) attribs ON items.item_id = attribs.item_id
GROUP BY items.item_id
LIMIT $pageSize OFFSET $pageIndex * $pageSize;
