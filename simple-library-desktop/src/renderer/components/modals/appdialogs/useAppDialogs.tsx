import {DialogEntry} from "../../../app/hooks/store/dialogState";
import React, {ReactElement} from "react";
import {ConfirmationDialog} from "./ConfirmationDialog";

export interface DialogOptions {
	content: ReactElement,
	blockOutside?: boolean, // => overlay + block pointer-events
}


export function useOpenDialog(addEntry: (e: DialogEntry) => void, removeEntry: (id: string) => void) {

	function openGeneric(optionsBuilder: (id: string) => DialogOptions) {
		const id = generateId();
		const options = optionsBuilder(id);
		const entry: DialogEntry = {
			id: id,
			content: options.content,
			blockOutside: options.blockOutside
		}
		addEntry(entry);
	}

	function openConfirmation(title: string, text: string, action: string, onAccept: () => void, onCancel?: () => void) {
		const id = generateId();
		const entry: DialogEntry = {
			id: id,
			content: <ConfirmationDialog title={title}
										 strContent={text}
										 action={action}
										 onResult={(accept: boolean) => {
											 removeEntry(id);
											 accept ? (onAccept && onAccept()) : (onCancel && onCancel());
										 }}/>,
			blockOutside: true
		}
		addEntry(entry);
	}

	function generateId(): string {
		return Date.now() + "-" + Math.random();
	}

	return {
		openGeneric: openGeneric,
		openConfirmation: openConfirmation
	};
}


export function useCloseDialog(removeEntry: (id: string) => void) {
	function close(entryId: string) {
		removeEntry(entryId);
	}

	return close;
}

