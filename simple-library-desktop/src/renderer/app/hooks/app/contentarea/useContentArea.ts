import {useActiveCollection, useCollections} from "../../base/collectionHooks";
import {Collection} from "../../../../../common/commonModels";

export function useContentArea() {

	const {
		findCollection
	} = useCollections();

	const {
		activeCollectionId,
	} = useActiveCollection();

	const activeCollection: Collection | null = findCollection(activeCollectionId);

	return {
		activeCollection: activeCollection
	}
}