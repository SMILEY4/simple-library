import React from "react";
import {Toolbar} from "../../../newcomponents/misc/toolbar/Toolbar";
import {IconButton} from "../../../newcomponents/buttons/iconbutton/IconButton";
import {IconType} from "../../../newcomponents/base/icon/Icon";

interface MainToolbarProps {
	onCloseLibrary: () => void,
	onImport: () => void,
}

export function MainToolbar(props: React.PropsWithChildren<MainToolbarProps>): React.ReactElement {

	return (
		<Toolbar>
			<IconButton label="Import" icon={IconType.IMPORT} large ghost onAction={props.onImport}/>
			<IconButton label="Close" icon={IconType.CLOSE} large ghost onAction={props.onCloseLibrary}/>
		</Toolbar>
	);

}
