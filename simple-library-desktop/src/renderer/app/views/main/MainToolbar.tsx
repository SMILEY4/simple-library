import React from "react";
import {Toolbar} from "../../../newcomponents/misc/toolbar/Toolbar";
import {IconButton} from "../../../newcomponents/buttons/iconbutton/IconButton";
import {IconType} from "../../../newcomponents/base/icon/Icon";
import {useCloseLibrary} from "../../hooks/libraryHooks";
import {useImportItems} from "../../hooks/itemHooks";

interface MainToolbarProps {
	onCloseLibrary: () => void
}

export function MainToolbar(props: React.PropsWithChildren<MainToolbarProps>): React.ReactElement {

	const {
		closeLibrary
	} = useCloseLibrary(props.onCloseLibrary)

	const {
		importItems
	} = useImportItems();

	return (
		<Toolbar>
			<IconButton label="Import" icon={IconType.IMPORT} large ghost onAction={importItems}/>
			<IconButton label="Close" icon={IconType.CLOSE} large ghost onAction={closeLibrary}/>
		</Toolbar>
	);

}
