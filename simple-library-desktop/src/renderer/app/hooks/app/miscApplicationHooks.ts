import {useState} from "react";
import {useItems} from "../base/itemHooks";
import {useActiveCollectionState} from "../base/activeCollectionHooks";

export function useDialogController(): [boolean, () => void, () => void] {

	const [show, setShow] = useState(false);

	function open() {
		setShow(true)
	}

	function close() {
		setShow(false)
	}

	return [show, open, close]
}


export function useReloadItems() {

	const {
		loadItems,
	} = useItems()

	const {
		activeCollectionId
	} = useActiveCollectionState()

	function reload(): void {
		activeCollectionId && loadItems(activeCollectionId);
	}

	return {
		reloadItems: reload
	}

}