import {DbAccess} from "../../persistence/dbAcces";
import {GroupCommons} from "./groupCommons";
import {ActionGetAllGroups} from "./actionGetAllGroups";
import {CollectionCommons} from "../collection/collectionCommons";
import Group = GroupCommons.Group;
import Collection = CollectionCommons.Collection;

/**
 * Get all groups as a tree. Optionally include collections and their item-counts.
 * The resulting group is a dummy group containing top-level groups and collections.
 */
export class ActionGetGroupTree {

	private readonly dbAccess: DbAccess;
	private readonly actionGetAllGroups: ActionGetAllGroups;

	constructor(dbAccess: DbAccess, actionGetAllGroups: ActionGetAllGroups) {
		this.dbAccess = dbAccess;
		this.actionGetAllGroups = actionGetAllGroups;
	}


	public perform(includeCollections: boolean, includeItemCount: boolean): Promise<Group> {
		return this.actionGetAllGroups.perform(includeCollections, includeItemCount)
			.then((groups: Group[]) => {
				const [groupMap, freeGroups] = this.groupsToIdMap(groups);
				const freeCollections = this.findFreeCollections(groups);
				this.connectGroups(groups, groupMap);
				return this.buildRootGroup(freeGroups, freeCollections);
			});
	}


	private groupsToIdMap(groups: Group[]): [Map<number, Group>, Group[]] {
		const map: Map<number, Group> = new Map();
		const freeGroups: Group[] = [];
		groups
			.filter((group: Group) => group.id !== null)
			.forEach((group: Group) => {
				map.set(group.id, group);
				if (group.parentGroupId === null) {
					freeGroups.push(group);
				}
			});
		return [map, freeGroups];
	}


	private connectGroups(groups: Group[], groupMap: Map<number, Group>) {
		groups
			.filter((current: Group) => current.id !== null)
			.forEach((current: Group) => {
				if (current.parentGroupId) {
					const parent: Group = groupMap.get(current.parentGroupId);
					parent.children.push(current);
				}
			});
	}


	private findFreeCollections(groups: Group[]): Collection[] {
		const freeCollectionsGroup: Group | undefined = groups.find((group: Group) => group.id === null);
		return (freeCollectionsGroup && freeCollectionsGroup.collections)
			? freeCollectionsGroup.collections
			: [];
	}


	private buildRootGroup(freeGroups: Group[], freeCollections: Collection[]): Group {
		return {
			id: null,
			name: "",
			parentGroupId: null,
			children: freeGroups,
			collections: freeCollections
		};
	}

}