import {useState} from "react";
import {useItems} from "./itemHooks";
import {useActiveCollectionState} from "./activeCollectionHooks";

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

