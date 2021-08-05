import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {ActionGetAllCollections} from "../collection/actionGetAllCollections";
import {Collection} from "../collection/collectionCommons";
import {Group, rowsToMinGroups} from "./groupCommons";

/**
 * Get all groups as a flat array. Optionally include collections and their item-counts.
 * If collections are included, a dummy-group (id = null) will be inserted with the top-level-collections.
 */
export class ActionGetAllGroups {

	private readonly dbAccess: DbAccess;
	private readonly actionGetAllCollections: ActionGetAllCollections;

	constructor(dbAccess: DbAccess, actionGetAllCollections: ActionGetAllCollections) {
		this.dbAccess = dbAccess;
		this.actionGetAllCollections = actionGetAllCollections;
	}


	public perform(includeCollections: boolean, includeItemCount: boolean): Promise<Group[]> {
		return this.query()
			.then(rowsToMinGroups)
			.then((groups: Group[]) => includeCollections ? this.enrich(groups, includeItemCount) : groups);
	}


	private query(): Promise<any | null> {
		return this.dbAccess.queryAll(SQL.queryAllGroups());
	}


	private enrich(groups: Group[], includeItemCount: boolean): Promise<Group[]> {
		return this.actionGetAllCollections.perform(includeItemCount)
			.then((collections: Collection[]) => {
				this.appendCollectionsToGroups(groups, collections);
				const freeCollectionsGroup = this.buildFreeCollectionsGroup(collections);
				return [freeCollectionsGroup, ...groups];
			});
	}


	private appendCollectionsToGroups(groups: Group[], collections: Collection[]) {
		groups.forEach((group: Group) => {
			group.collections = this.findCollectionsForGroup(group, collections);
		});
	}


	private buildFreeCollectionsGroup(collections: Collection[]): Group {
		return {
			id: null,
			name: "",
			parentGroupId: null,
			children: [],
			collections: this.findFreeCollections(collections)
		};
	}

	private findCollectionsForGroup(group: Group, collections: Collection[]): Collection[] {
		return collections.filter((collection: Collection) => collection.groupId === group.id);
	}


	private findFreeCollections(collections: Collection[]): Collection[] {
		return collections.filter((collection: Collection) => collection.groupId === null);
	}

}