import {useCollectionsContext} from "../../store/collectionsState";
import {CollectionDTO, GroupDTO} from "../../../../common/events/dtoModels";
import {extractCollections, extractGroups} from "../../common/utils";

export function useCollectionsState() {

	const [collectionsState] = useCollectionsContext();

	function findCollection(collectionId: number): CollectionDTO | null {
		if (collectionId) {
			const result: CollectionDTO | undefined = extractCollections(collectionsState.rootGroup).find(collection => collection.id === collectionId);
			return result ? result : null;
		} else {
			return null;
		}
	}

	function findGroup(groupId: number): GroupDTO | null {
		const result: GroupDTO | undefined = extractGroups(collectionsState.rootGroup).find(group => group.id === groupId);
		return result ? result : null;
	}

	return {
		rootGroup: collectionsState.rootGroup,
		findCollection: findCollection,
		findGroup: findGroup
	}
}
