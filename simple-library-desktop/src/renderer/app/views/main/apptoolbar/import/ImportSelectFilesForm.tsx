import React from "react";
import {FileInputField} from "../../../../../newcomponents/input/fileinputfield/FileInputField";
import {ElementLabel} from "../../../../../newcomponents/misc/elementlabel/ElementLabel";

const electron = window.require('electron');


interface ImportSelectFilesFormProps {
	error: boolean,
	onSelectFiles: (files: string[]) => void

}

export function ImportSelectFilesForm(props: React.PropsWithChildren<ImportSelectFilesFormProps>): React.ReactElement {

	return (
		<ElementLabel text="Select files to import:">
			<FileInputField
				placeholder={"Files"}
				error={props.error}
				onBrowse={handleBrowseFiles}
				onSelect={props.onSelectFiles}
			/>
		</ElementLabel>
	);

	function handleBrowseFiles(): Promise<string[] | null> {
		return electron.remote.dialog
			.showOpenDialog({
				title: 'Select Files',
				buttonLabel: 'Select',
				properties: [
					'openFile',
					'multiSelections',
					'dontAddToRecent',
				],
			})
			.then((result: any) => {
				if (result.canceled) {
					return null;
				} else {
					return result.filePaths;
				}
			});
	}

}
