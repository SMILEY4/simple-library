-- $groupId (number): the id of the group to delete
DELETE
FROM groups
WHERE group_id = $groupId;