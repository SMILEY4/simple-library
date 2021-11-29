-- entries: the default attribute values in the following format: "(attId1,value1,allowOverwrite1), (attId2,value2,allowOverwrite2), ..."
INSERT INTO default_attribute_values
(att_id,
 value,
 allowOverwrite)
VALUES $entries;