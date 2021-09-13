import React from "react";
import {Toolbar} from "../../../../components/misc/toolbar/Toolbar";
import {IconButton} from "../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../components/base/icon/Icon";
import {DialogImportFiles} from "./import/DialogImportFiles";
import {useDialogImportFilesController} from "./import/useDialogImportFiles";
import {useAppToolbar} from "./appToolbarHooks";

interface AppToolbarProps {
	onClosedLibrary: () => void
}

export function AppToolbar(props: React.PropsWithChildren<AppToolbarProps>): React.ReactElement {

	const {
		closeLibrary,
		openConfigFile
	} = useAppToolbar(props.onClosedLibrary)

	const [
		showImportDialog,
		openImportDialog,
		closeImportDialog
	] = useDialogImportFilesController();

	return (
		<>
			<Toolbar>
				<IconButton label="Close" icon={IconType.CLOSE} large ghost onAction={closeLibrary}/>
				<IconButton label="Config" icon={IconType.SETTINGS} large ghost onAction={openConfigFile}/>
				<IconButton label="Import" icon={IconType.IMPORT} large ghost onAction={openImportDialog}/>
			</Toolbar>

			{showImportDialog && (<DialogImportFiles onClose={closeImportDialog}/>)}

		</>
	);

}
