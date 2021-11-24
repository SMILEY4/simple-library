import {fetchHiddenAttributes, requestSetHiddenAttributes} from "../../common/eventInterface";
import {AttributeKeyDTO} from "../../../../common/events/dtoModels";
import {useEffect, useState} from "react";
import {voidThen} from "../../../../common/utils";


export function useHideAttributes() {

	function get(): Promise<AttributeKeyDTO[]> {
		return fetchHiddenAttributes();
	}

	function show(attributes: AttributeKeyDTO[]): Promise<void> {
		return set(attributes, "show").then(voidThen);
	}

	function hide(attributes: AttributeKeyDTO[]): Promise<void> {
		return set(attributes, "hide").then(voidThen);
	}

	function set(attributes: AttributeKeyDTO[], mode: "show" | "hide"): Promise<AttributeKeyDTO[]> {
		return requestSetHiddenAttributes(attributes, mode)
			.then(() => get());
	}

	return {
		getHiddenAttributes: get,
		hideAttributes: hide,
		showAttributes: show,
		setHiddenAttributes: set
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
