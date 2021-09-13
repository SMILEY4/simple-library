import {CollectionDTO} from "../../../../../common/events/dtoModels";
import {useActiveCollection} from "../../../store/collectionActiveState";
import {useFindCollection} from "../../../store/collectionsState";

export function useContentArea() {

	const activeCollectionId = useActiveCollection();
	const findCollection = useFindCollection();

	const activeCollection: CollectionDTO | null = findCollection(activeCollectionId);

	return {
		activeCollection: activeCollection
	}
}
