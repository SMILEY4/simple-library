-- attId (integer): the unique id of the attribute
DELETE
FROM hidden_attributes
WHERE att_id = $attId;