-- entries: the attributes in the following format: "(id1,name1, type1, writable1, g01, g11, g21), (id1,name2, type2, writable2, g02, g12, g22), ..."
INSERT OR IGNORE INTO attribute_meta
(id,
 name,
 type,
 writable,
 g0,
 g1,
 g2)
VALUES $entries;
