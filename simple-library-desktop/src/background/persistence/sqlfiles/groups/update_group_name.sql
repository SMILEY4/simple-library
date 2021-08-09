-- groupName (string): the new name of the group
-- groupId (number): the id of the group to rename
UPDATE groups
SET name = $groupName
WHERE group_id = $groupId;