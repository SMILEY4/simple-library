import {CollectionActiveActionType, useCollectionActiveContext} from "../../store/collectionActiveState";


export function useActiveCollectionState() {

	const [activeCollectionState, activeCollectionDispatch] = useCollectionActiveContext();

	function open(collectionId: number): void {
		if (activeCollectionState.activeCollectionId !== collectionId) {
			activeCollectionDispatch({
				type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
				payload: collectionId
			});
		}
	}

	function close(): void {
		activeCollectionDispatch({
			type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
			payload: null
		});
	}

	return {
		activeCollectionId: activeCollectionState.activeCollectionId,
		openCollection: open,
		closeCollection: close,
	}
}