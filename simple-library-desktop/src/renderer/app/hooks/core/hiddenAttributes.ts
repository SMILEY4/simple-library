import {fetchHiddenAttributes, fetchItems, requestSetHiddenAttributes} from "../../common/eventInterface";
import {AttributeMetaDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {voidThen} from "../../../../common/utils";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {useSelectedItemIds} from "../store/itemSelectionState";
import {useLoadAttributes} from "./attributesLoad";
import {TEMP_ATTRIBUTE_IDS} from "./temp";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {ArrayUtils} from "../../../../common/arrayUtils";


export function useHideAttributes() {

	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const selectedItemIds = useSelectedItemIds();
	const loadAttributes = useLoadAttributes();
	const dispatchSetItems = useDispatchSetItems();
	const activeCollection = useActiveCollection();

	function get(): Promise<AttributeMetaDTO[]> {
		return fetchHiddenAttributes();
	}

	function show(attributeIds: number[]): Promise<void> {
		return setHiddenStatus(attributeIds, "show")
			.then(() => {
				return (selectedItemIds && selectedItemIds.length === 1)
					? loadAttributes(selectedItemIds[0])
					: loadAttributes(null);
			})
			.then(() => {
				if (ArrayUtils.containsSomeOf(TEMP_ATTRIBUTE_IDS, attributeIds)) {
					return fetchItems(activeCollection, TEMP_ATTRIBUTE_IDS, true, false)
						.then((items: ItemDTO[]) => dispatchSetItems(items));
				}
			})
			.then(voidThen);
	}

	function hide(attributeIds: number[]): Promise<void> {
		return setHiddenStatus(attributeIds, "hide")
			.then(() => attributeIds.forEach(dispatchRemoveAttribute))
			.then(() => {
				if (ArrayUtils.containsSomeOf(TEMP_ATTRIBUTE_IDS, attributeIds)) {
					return fetchItems(activeCollection, TEMP_ATTRIBUTE_IDS, true, false)
						.then((items: ItemDTO[]) => dispatchSetItems(items));
				}
			})
			.then(voidThen);
	}

	function setHiddenStatus(attributeIds: number[], mode: "show" | "hide"): Promise<any> {
		return requestSetHiddenAttributes(attributeIds, mode);
	}

	return {
		getHiddenAttributes: get,
		hideAttributes: hide,
		showAttributes: show
	};
}
