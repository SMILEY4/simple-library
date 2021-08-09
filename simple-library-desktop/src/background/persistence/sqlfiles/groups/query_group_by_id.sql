-- $groupId (number): the id of the group to find
SELECT *
FROM groups
WHERE group_id = $groupId;