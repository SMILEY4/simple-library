import {useState} from "react";
import {useEmbedAttributes} from "../../../../hooks/core/attributesEmbed";

export enum EmbedDialogItemSelection {
	ALL,
	SELECTION
}

export enum EmbedDialogAttributeSelection {
	ALL,
	MODIFIED
}

export function useDialogEmbedAttributes(onClose: () => void) {

	const [itemSelection, setItemSelection] = useState(EmbedDialogItemSelection.ALL);
	const [attributeSelection, setAttributeSelection] = useState(EmbedDialogAttributeSelection.MODIFIED);
	const embedAttributes = useEmbedAttributes();

	function handleCancel() {
		onClose();
	}

	function handleEmbed() {
		embedAttributes(
			itemSelection === EmbedDialogItemSelection.SELECTION,
			attributeSelection === EmbedDialogAttributeSelection.ALL
		).then();
		onClose();
	}

	function handleSetItemSelection(selectAll: boolean) {
		setItemSelection(selectAll
			? EmbedDialogItemSelection.ALL
			: EmbedDialogItemSelection.SELECTION);
	}

	function handleSetAttributeSelection(selectAll: boolean) {
		setAttributeSelection(selectAll
			? EmbedDialogAttributeSelection.ALL
			: EmbedDialogAttributeSelection.MODIFIED);
	}

	return {
		handleCancel: handleCancel,
		handleEmbed: handleEmbed,
		itemSelection: itemSelection,
		attributeSelection: attributeSelection,
		setItemSelection: handleSetItemSelection,
		setAttributeSelection: handleSetAttributeSelection
	};

}