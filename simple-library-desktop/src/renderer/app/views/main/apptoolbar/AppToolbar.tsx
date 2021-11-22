import React from "react";
import {Toolbar} from "../../../../components/misc/toolbar/Toolbar";
import {IconButton} from "../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../components/base/icon/Icon";
import {DialogImportFiles} from "./import/DialogImportFiles";
import {useAppToolbar} from "./useAppToolbar";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../../hooks/store/dialogState";
import {DialogEmbedAttributes} from "./embed/DialogEmbedAttributes";
import {DialogSettings} from "./settings/DialogSettings";

interface AppToolbarProps {
	onClosedLibrary: () => void
}

export function AppToolbar(props: React.PropsWithChildren<AppToolbarProps>): React.ReactElement {

	const openDialog = useDispatchOpenDialog();
	const closeDialog = useDispatchCloseDialog();

	const {
		closeLibrary,
		openConfigFile // todo
	} = useAppToolbar(props.onClosedLibrary)

	return (
		<Toolbar>
			<IconButton label="Close" icon={IconType.CLOSE} large ghost onAction={closeLibrary}/>
			<IconButton label="Settings" icon={IconType.SETTINGS} large ghost onAction={openDialogSettings}/>
			<IconButton label="Import" icon={IconType.IMPORT} large ghost onAction={openDialogImport}/>
			<IconButton label="Embed" icon={IconType.FILE_IMPORT} large ghost onAction={openDialogEmbed}/>
		</Toolbar>
	);

	function openDialogSettings() {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogSettings onClose={() => closeDialog(id)}/>
		}));
	}

	function openDialogImport() {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogImportFiles onClose={() => closeDialog(id)}/>
		}));
	}

	function openDialogEmbed() {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogEmbedAttributes onClose={() => closeDialog(id)}/>
		}));
	}
}
