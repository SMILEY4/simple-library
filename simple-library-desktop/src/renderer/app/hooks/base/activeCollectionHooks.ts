import {
	useCollectionActiveContext,
	useDispatchClearActiveCollection,
	useDispatchSetActiveCollection
} from "../../store/collectionActiveState";


export function useActiveCollectionState() {

	const [activeCollectionState] = useCollectionActiveContext();
	const dispatchSetActiveCollection = useDispatchSetActiveCollection();
	const dispatchClearActiveCollection = useDispatchClearActiveCollection();


	function open(collectionId: number): void {
		if (activeCollectionState.activeCollectionId !== collectionId) {
			dispatchSetActiveCollection(collectionId);
		}
	}

	function close(): void {
		dispatchClearActiveCollection();
	}

	return {
		activeCollectionId: activeCollectionState.activeCollectionId,
		openCollection: open,
		closeCollection: close,
	}
}
