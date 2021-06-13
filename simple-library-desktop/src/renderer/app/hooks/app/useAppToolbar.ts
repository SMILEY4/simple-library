import {useState} from "react";

export function useAppToolbar() {

	const [
		showDialogImportFiles,
		setShowDialogImportFiles,
	] = useState(null);

	function openImportFiles() {
		setShowDialogImportFiles(true)
	}

	function closeImportFiles() {
		setShowDialogImportFiles(false)
	}

	return {
		showDialogImportFiles: showDialogImportFiles,
		openImportFiles,
		closeImportFiles,
	}

}