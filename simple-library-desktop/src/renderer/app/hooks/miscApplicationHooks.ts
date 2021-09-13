import {useState} from "react";

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

