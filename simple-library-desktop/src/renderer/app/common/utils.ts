import {CollectionDTO, GroupDTO, RenamePartTypeDTO} from "../../../common/events/dtoModels";


export function renamePartTypeAllowsUserInput(type: RenamePartTypeDTO): boolean {
	switch (type) {
		case "nothing":
			return false;
		case "text":
			return true;
		case "number_from":
			return true;
		case "original_filename":
			return false;
	}
}


export function extractCollections(group: GroupDTO | null): CollectionDTO[] {
	const collections: CollectionDTO[] = [];
	if (group) {
		collections.push(...group.collections);
		group.children.forEach((child: GroupDTO) => {
			collections.push(...extractCollections(child));
		});
	}
	return collections;
}


export function extractGroups(group: GroupDTO | null): GroupDTO[] {
	const groups: GroupDTO[] = [];
	if (group) {
		groups.push(...group.children);
		group.children.forEach((child: GroupDTO) => {
			groups.push(...extractGroups(child));
		});
	}
	return groups;
}
