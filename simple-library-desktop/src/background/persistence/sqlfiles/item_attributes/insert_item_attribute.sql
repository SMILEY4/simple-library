-- entries: the attributes in the following format: "(key1, value1, type1, item_id1), (key2, value3, type4, item_id5), ..."
INSERT INTO item_attributes
(key,
 value,
 type,
 item_id)
VALUES $entries;