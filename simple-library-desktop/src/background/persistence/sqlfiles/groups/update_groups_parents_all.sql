-- $parentGroupId (number, null): the id of the new parent
-- $prevParentGroupId (number, null): the id of the previous parent
UPDATE groups
SET parent_group_id = $parentGroupId
WHERE parent_group_id = $prevParentGroupId;