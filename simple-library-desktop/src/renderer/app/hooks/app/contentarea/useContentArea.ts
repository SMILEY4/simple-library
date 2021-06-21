import { useCollectionsState} from "../../base/collectionHooks";
import {Collection} from "../../../../../common/commonModels";
import {useActiveCollectionState} from "../../base/activeCollectionHooks";

export function useContentArea() {

	const {
		activeCollectionId,
	} = useActiveCollectionState();

	const {
		findCollection
	} = useCollectionsState();


	const activeCollection: Collection | null = findCollection(activeCollectionId);

	return {
		activeCollection: activeCollection
	}
}