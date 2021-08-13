import { useCollectionsState} from "../../base/collectionHooks";
import {useActiveCollectionState} from "../../base/activeCollectionHooks";
import {CollectionDTO} from "../../../../../common/events/dtoModels";

export function useContentArea() {

	const {
		activeCollectionId,
	} = useActiveCollectionState();

	const {
		findCollection
	} = useCollectionsState();


	const activeCollection: CollectionDTO | null = findCollection(activeCollectionId);

	return {
		activeCollection: activeCollection
	}
}
