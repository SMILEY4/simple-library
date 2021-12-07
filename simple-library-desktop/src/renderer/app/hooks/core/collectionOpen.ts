import {
	useCollectionActiveContext,
	useDispatchSetActiveCollection,
	useDispatchSetItemFilter
} from "../store/collectionActiveState";
import {useDispatchItemSelectionClear} from "../store/itemSelectionState";
import {useLoadItems} from "./itemsLoad";

export function useOpenCollection() {

	const [activeCollectionState] = useCollectionActiveContext();
	const dispatchSetActiveCollection = useDispatchSetActiveCollection();
	const dispatchClearSelection = useDispatchItemSelectionClear();
	const dispatchSetItemFilter = useDispatchSetItemFilter();
	const loadItems = useLoadItems();


	function hookFunction(collectionId: number) {
		if (activeCollectionState.activeCollectionId !== collectionId) {
			dispatchSetActiveCollection(collectionId);
			dispatchClearSelection();
			dispatchSetItemFilter(null);
			loadItemState(collectionId);
		}
	}

	function loadItemState(collectionId: number) {
		loadItems({collectionId: collectionId, filter: null}).then();
	}

	return hookFunction;
}
