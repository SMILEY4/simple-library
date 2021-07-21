import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {Collection, CollectionService} from "./collectionService";

export interface Group {
	id: number,
	name: string,
	parentGroupId: number | null,
	collections: Collection[]
	children: Group[],
}

export class GroupService {

	private readonly dbAccess: DbAccess;
	private readonly collectionService: CollectionService;

	constructor(dbAccess: DbAccess, collectionService: CollectionService) {
		this.dbAccess = dbAccess;
		this.collectionService = collectionService;
	}

	/**
	 * Get a group by the given group-id (without its collections and child-groups)
	 */
	public getById(groupId: number): Promise<Group | null> {
		return this.dbAccess.querySingle(SQL.queryGroupById(groupId))
			.then((row: any) => ({
				id: row.group_id,
				name: row.name,
				parentGroupId: row.parent_group_id,
				collections: [],
				children: []
			}));
	}

	/**
	 * Get all groups as a flat array. Optionally include collections and their item-counts.
	 * If collections are included, a dummy-group (id = null) will be inserted with the top-level-collections.
	 */
	public getAll(includeCollections: boolean, includeItemCount: boolean): Promise<Group[]> {
		return this.dbAccess.queryAll(SQL.queryAllGroups())
			.then((rows: any[]) => rows.map(GroupService.rowToMinGroup))
			.then((groups: Group[]) => includeCollections ? this.appendCollections(groups, includeItemCount) : groups);
	}

	/**
	 * Get all groups as a tree. Optionally include collections and their item-counts.
	 * The resulting group is a dummy group containing top-level groups and collections.
	 */
	public getTree(includeCollections: boolean, includeItemCount: boolean): Promise<Group> {
		return this.getAll(includeCollections, includeItemCount)
			.then((groups: Group[]) => {

				const dummyGroup: Group | undefined = groups.find((current: Group) => current.id === null);

				const topLevelGroups: Group[] = [];
				const groupMap: Map<number, Group> = new Map();

				groups
					.filter((current: Group) => current.id !== null)
					.forEach((current: Group) => {
						groupMap.set(current.id, current);
						if (current.parentGroupId === null) {
							topLevelGroups.push(current);
						}
					});

				groups
					.filter((current: Group) => current.id !== null)
					.forEach((current: Group) => {
						if (current.parentGroupId) {
							const parent: Group = groupMap.get(current.parentGroupId);
							parent.children.push(current);
						}
					});

				return {
					id: null,
					name: "",
					parentGroupId: null,
					children: topLevelGroups,
					collections: dummyGroup ? dummyGroup.collections : []
				};
			});
	}

	/**
	 * Create a new group with the given name and (optionally) the given parent.
	 */
	public create(name: string, parentGroupId: number | null): Promise<Group> {
		return this.dbAccess.run(SQL.insertGroup(name, parentGroupId))
			.then((id: number) => ({
				id: id,
				name: name,
				parentGroupId: parentGroupId,
				collections: [],
				children: []
			}));
	}

	/**
	 * Delete the group with the given id. Optionally delete all its children.
	 * If not delete children => children will be added to the groups parent
	 */
	public delete(groupId: number, deleteChildren: boolean): Promise<void> {
		if (deleteChildren) {
			return this.dbAccess.run(SQL.deleteGroup(groupId)).then();
		} else {
			return this.getById(groupId)
				.then((group: Group | null) => {
					if (group === null) {
						throw "Could not delete group. Group with id " + groupId + " does not exist.";
					} else {
						return group;
					}
				})
				.then((group: Group) => {
					const groupId: number = group.id;
					const parentId: number | null = group.parentGroupId ? group.parentGroupId : null;
					return Promise.all([
						this.moveAllOfParent(groupId, parentId),
						this.collectionService.moveAllOfParent(groupId, parentId)
					]);
				})
				.then(() => this.dbAccess.run(SQL.deleteGroup(groupId)))
				.then();
		}
	}

	/**
	 * Rename the group with the given id.
	 */
	public rename(groupId: number, name: string): Promise<void> {
		return this.dbAccess.run(SQL.updateGroupName(groupId, name)).then();
	}

	/**
	 * Move the group with the given id into the given target group.
	 */
	public move(groupId: number, targetGroupId: number | null): Promise<void> {
		return this.validateGroupMovement(groupId, targetGroupId).then((valid: boolean) => {
			if (valid) {
				return this.dbAccess.run(SQL.updateGroupParent(groupId, targetGroupId)).then();
			} else {
				return Promise.reject("Group cant be moved: invalid.");
			}
		});
	}

	/**
	 * Moves all child groups of the given parent group into the new group.
	 */
	public moveAllOfParent(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateGroupParents(prevParentGroupId, newParentGroupId)).then();
	}

	private appendCollections(groups: Group[], includeItemCount: boolean): Promise<Group[]> {
		return this.collectionService.getAll(includeItemCount)
			.then((collections: Collection[]) => {
				groups.forEach((group: Group) => {
					group.collections = collections.filter((collection: Collection) => collection.groupId === group.id);
				});
				const tlGroup: Group = {
					id: null,
					name: "",
					parentGroupId: null,
					children: [],
					collections: collections.filter((collection: Collection) => collection.groupId === null)
				};
				return [tlGroup, ...groups];
			});
	}

	private async validateGroupMovement(groupId: number, targetGroupId: number | null): Promise<boolean> {

		// 1. group =!= targetGroupId
		if (groupId === targetGroupId) {
			console.debug("Invalid group-movement: group = target");
			return false;
		}

		// 2. group, target-group exists
		const groupExists = await this.getById(groupId) !== null;
		const targetExists = targetGroupId === null || (await this.getById(targetGroupId) !== null);
		if (!groupExists || !targetExists) {
			console.debug("Invalid group-movement: group or target does not exist");
			return false;
		}

		// 3. group can not be moved into a group of the subtree with itself as the root
		if (targetGroupId) {
			const targetGroup: Group = await this.getById(targetGroupId);
			let counter: number = 0;
			let currentGroup: Group = targetGroup;
			while (currentGroup.parentGroupId !== null && currentGroup.id !== groupId && counter < 100) {
				currentGroup = await this.getById(currentGroup.parentGroupId);
				counter++;
			}
			if (currentGroup.id === groupId || counter >= 100) {
				console.debug("Invalid group-movement: target in subtree of group");
				return false;
			}
		}

		return true;
	}

	private static rowToMinGroup(row: any): Group {
		return {
			id: row.group_id,
			name: row.name,
			parentGroupId: row ? row.parent_group_id : null,
			children: [],
			collections: []
		};
	}

}