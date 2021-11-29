-- attributeIds: the list of attributeIds to insert in the following format: "(attId1,index1), (attId2,index2), (attId3,index3)"
INSERT INTO item_list_attributes
	(att_id, att_index)
VALUES $attributeIds;