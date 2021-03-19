UPDATE groups
SET parent_group_id = $parentGroupId
WHERE parent_group_id = $prevParentGroupId;