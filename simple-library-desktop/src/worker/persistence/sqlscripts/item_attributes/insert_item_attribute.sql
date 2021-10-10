-- entries: the attributes in the following format: "(key1, value1, type1, item_id1, modified1), (key2, value3, type4, item_id5, modified2), ..."
INSERT INTO item_attributes
(key,
 g0,
 g1,
 g2,
 value,
 item_id,
 modified)
VALUES $entries;