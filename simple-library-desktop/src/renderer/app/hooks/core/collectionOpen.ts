import {useCollectionActiveContext, useDispatchSetActiveCollection} from "../store/collectionActiveState";
import {useDispatchItemSelectionClear} from "../store/itemSelectionState";
import {useLoadItems} from "./itemsLoad";

export function useOpenCollection() {

	const [activeCollectionState] = useCollectionActiveContext();
	const dispatchSetActiveCollection = useDispatchSetActiveCollection();
	const dispatchClearSelection = useDispatchItemSelectionClear();
	const loadItems = useLoadItems();


	function hookFunction(collectionId: number) {
		if (activeCollectionState.activeCollectionId !== collectionId) {
			dispatchSetActiveCollection(collectionId);
			dispatchClearSelection();
			loadItemState(collectionId);
		}
	}

	function loadItemState(collectionId: number) {
		loadItems({collectionId: collectionId}).then();
	}

	return hookFunction;
}
