import {fetchHiddenAttributes, fetchItemListAttributes, requestSetHiddenAttributes} from "../../common/eventInterface";
import {AttributeMetaDTO} from "../../../../common/events/dtoModels";
import {voidThen} from "../../../../common/utils";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {useSelectedItemIds} from "../store/itemSelectionState";
import {useLoadAttributes} from "./attributesLoad";
import {ArrayUtils} from "../../../../common/arrayUtils";
import {useLoadItems} from "./itemsLoad";


export function useHideAttributes() {

	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const selectedItemIds = useSelectedItemIds();
	const loadAttributes = useLoadAttributes();
	const loadItems = useLoadItems();

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
			.then(() => fetchItemListAttributes())
			.then((itemListAttribs) => {
				if (ArrayUtils.containsSomeOf(itemListAttribs.map(e => e.attId), attributeIds)) {
					return loadItems({});
				}
			})
			.then(voidThen);
	}

	function hide(attributeIds: number[]): Promise<void> {
		return setHiddenStatus(attributeIds, "hide")
			.then(() => attributeIds.forEach(dispatchRemoveAttribute))
			.then(() => fetchItemListAttributes())
			.then((itemListAttribs) => {
				if (ArrayUtils.containsSomeOf(itemListAttribs.map(e => e.attId), attributeIds)) {
					return loadItems({});
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
