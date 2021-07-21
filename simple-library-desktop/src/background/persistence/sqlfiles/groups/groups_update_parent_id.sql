UPDATE groups
SET parent_group_id = $parentGroupId
WHERE group_id = $groupId;