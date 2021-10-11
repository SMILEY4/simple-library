-- entries: the attributes in the following format: "(name1,g01,g11,g21,itemId1,value1,modified1), (name2,g02,g12,g22,itemId2,value2,modified2), ..."
INSERT INTO item_attributes
(id,
 name,
 g0,
 g1,
 g2,
 item_id,
 value,
 modified)
VALUES $entries;