UPDATE collections
SET group_id = $groupId
WHERE group_id = $prevGroupId;