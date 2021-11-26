import {fetchHiddenAttributes, fetchItems, requestSetHiddenAttributes} from "../../common/eventInterface";
import {AttributeKeyDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {useEffect, useState} from "react";
import {voidThen} from "../../../../common/utils";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {useSelectedItemIds} from "../store/itemSelectionState";
import {useLoadAttributes} from "./attributesLoad";
import {useOpenCollection} from "./collectionOpen";
import {TEMP_ATTRIBUTE_KEYS} from "./temp";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";


export function useHideAttributes() {

	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const selectedItemIds = useSelectedItemIds();
	const loadAttributes = useLoadAttributes();
	const dispatchSetItems = useDispatchSetItems();
	const activeCollection = useActiveCollection();

	function get(): Promise<AttributeKeyDTO[]> {
		return fetchHiddenAttributes();
	}

	function show(attributes: AttributeKeyDTO[]): Promise<void> {
		return setHiddenStatus(attributes, "show")
			.then(() => {
				return (selectedItemIds && selectedItemIds.length === 1)
					? loadAttributes(selectedItemIds[0])
					: loadAttributes(null);
			})
			.then(() => {
				//todo: only if any attribute is displayed in list
				return fetchItems(activeCollection, TEMP_ATTRIBUTE_KEYS, true, false)
					.then((items: ItemDTO[]) => dispatchSetItems(items));
			})
			.then(voidThen);
	}

	function hide(attributes: AttributeKeyDTO[]): Promise<void> {
		return setHiddenStatus(attributes, "hide")
			.then(() => attributes.forEach(dispatchRemoveAttribute))
			.then(() => {
				//todo: only if any attribute is displayed in list
				return fetchItems(activeCollection, TEMP_ATTRIBUTE_KEYS, true, false)
					.then((items: ItemDTO[]) => dispatchSetItems(items));
			})
			.then(voidThen);
	}

	function setHiddenStatus(attributes: AttributeKeyDTO[], mode: "show" | "hide"): Promise<AttributeKeyDTO[]> {
		return requestSetHiddenAttributes(attributes, mode)
			.then(() => get());
	}

	return {
		getHiddenAttributes: get,
		hideAttributes: hide,
		showAttributes: show
	};
}


export function useHiddenAttributes() {

	const [hidden, setHidden] = useState([]);
	const {getHiddenAttributes} = useHideAttributes();

	useEffect(() => {
		getHiddenAttributes().then(setHidden);
	}, []);

	return {
		hiddenAttributes: hidden
	};
}
