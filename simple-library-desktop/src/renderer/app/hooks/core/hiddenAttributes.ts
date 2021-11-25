import {fetchHiddenAttributes, requestSetHiddenAttributes} from "../../common/eventInterface";
import {AttributeKeyDTO} from "../../../../common/events/dtoModels";
import {useEffect, useState} from "react";
import {voidThen} from "../../../../common/utils";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {useSelectedItemIds} from "../store/itemSelectionState";
import {useLoadAttributes} from "./attributesLoad";


export function useHideAttributes() {

	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const selectedItemIds = useSelectedItemIds();
	const loadAttributes = useLoadAttributes();


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
			.then(voidThen);
	}

	function hide(attributes: AttributeKeyDTO[]): Promise<void> {
		return setHiddenStatus(attributes, "hide")
			.then(() => attributes.forEach(dispatchRemoveAttribute))
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
