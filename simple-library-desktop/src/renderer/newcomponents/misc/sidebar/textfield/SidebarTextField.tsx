import {BaseProps} from "../../../utils/common";
import {IconType} from "../../../base/icon/Icon";
import React, {ReactElement} from "react";
import {TextField, TextFieldProps} from "../../../input/textfield/TextField";
import "./sidebarTextField.css"

export interface SidebarTextFieldProps extends TextFieldProps {
}

export function SidebarTextField(props: React.PropsWithChildren<SidebarTextFieldProps>): ReactElement {

	return (
		<div className={"sidebar-text-field"}>
			<TextField {...props} />
		</div>
	);

}
