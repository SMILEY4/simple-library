-- entries: the attributes in the following format: "(attId1,itemId1,value1,modified1), (attId2,itemId2,value2,modified2), ..."
INSERT INTO item_attributes
(att_id,
 item_id,
 value,
 modified)
VALUES $entries;