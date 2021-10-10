-- $groupName (string): the name of the group
-- $parentGroupId (number): the parent group or null
INSERT INTO groups (name, parent_group_id)
VALUES ($groupName, $parentGroupId);