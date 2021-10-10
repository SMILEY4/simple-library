-- entries: the attributes in the following format: "(name1, type1, writable1, g01, g11, g21), (name2, type2, writable2, g02, g12, g22), ..."
INSERT INTO attribute_meta
(name,
 type,
 writable,
 g0,
 g1,
 g2)
VALUES $entries;
