-- parentGroupId (number, null): the id of the new parent-group
-- groupId (number): the id of the group to update
UPDATE groups
SET parent_group_id = $parentGroupId
WHERE group_id = $groupId;