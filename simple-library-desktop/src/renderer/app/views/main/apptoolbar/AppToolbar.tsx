import React from "react";
import {Toolbar} from "../../../../newcomponents/misc/toolbar/Toolbar";
import {IconButton} from "../../../../newcomponents/buttons/iconbutton/IconButton";
import {IconType} from "../../../../newcomponents/base/icon/Icon";
import {useLibraries} from "../../../hooks/libraryHooks";
import {useAppToolbar} from "./useAppToolbar";
import {DialogImportFiles} from "./import/DialogImportFiles";

interface AppToolbarProps {
	onClosedLibrary: () => void
}

export function AppToolbar(props: React.PropsWithChildren<AppToolbarProps>): React.ReactElement {

	const {
		closeLibrary
	} = useLibraries()

	const {
		showDialogImportFiles,
		openImportFiles,
		closeImportFiles,
	} = useAppToolbar()

	return (
		<>
			<Toolbar>
				<IconButton label="Import" icon={IconType.IMPORT} large ghost onAction={openImportFiles}/>
				<IconButton label="Close" icon={IconType.CLOSE} large ghost onAction={handleOnClose}/>
			</Toolbar>

			{showDialogImportFiles && (
				<DialogImportFiles onClose={closeImportFiles}/>
			)}

		</>
	);

	function handleOnClose() {
		closeLibrary()
			.then(() => props.onClosedLibrary())
	}

}
