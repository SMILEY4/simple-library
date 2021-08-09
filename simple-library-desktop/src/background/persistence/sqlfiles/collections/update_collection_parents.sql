-- groupId (number, null): the id of the new parent-group
-- prevGroupId (number, null): the id of the previous parent-group
UPDATE collections
SET group_id = $groupId
WHERE group_id = $prevGroupId;