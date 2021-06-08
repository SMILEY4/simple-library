import React from "react";
import {Toolbar} from "../../../../newcomponents/misc/toolbar/Toolbar";
import {IconButton} from "../../../../newcomponents/buttons/iconbutton/IconButton";
import {IconType} from "../../../../newcomponents/base/icon/Icon";
import {useItems} from "../../../hooks/itemHooks";
import {useLibraries} from "../../../hooks/libraryHooks";

interface AppToolbarProps {
	onClosedLibrary: () => void
}

export function AppToolbar(props: React.PropsWithChildren<AppToolbarProps>): React.ReactElement {

	const {
		closeLibrary
	} = useLibraries()

	const {
		importItems
	} = useItems();

	return (
		<Toolbar>
			<IconButton label="Import" icon={IconType.IMPORT} large ghost onAction={handleOnImport}/>
			<IconButton label="Close" icon={IconType.CLOSE} large ghost onAction={handleOnClose}/>
		</Toolbar>
	);

	function handleOnImport() {
		importItems();
	}

	function handleOnClose() {
		closeLibrary()
			.then(() => props.onClosedLibrary())
	}

}
