import {BaseProps} from "../../utils/common";
import React, {useState} from "react";
import {Group} from "../../layout/group/Group";
import {TextField} from "../textfield/TextField";
import {IconType} from "../../base/icon/Icon";
import {Button} from "../../buttons/button/Button";
import {concatClasses} from "../../../components/common/common";

interface DirectoryInputFieldProps extends BaseProps {
	directory?: string,
	disabled?: boolean,
	placeholder?: string,
	error?: boolean,
	onBrowse?: () => Promise<string | null>
	onSelect?: (directory: string) => void,
}

export function DirectoryInputField(props: React.PropsWithChildren<DirectoryInputFieldProps>): React.ReactElement {

	const [value, setValue] = useState(props.directory ? props.directory : "");

	return (
		<Group
			className={concatClasses(props.className, "directory-field")}
			error={props.error}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			<TextField
				value={value}
				forceState
				fixed
				disabled={props.disabled}
				placeholder={props.placeholder}
				prependIcon={IconType.FOLDER}
				dir={value ? "rtl" : undefined}
			/>
			<Button
				disabled={props.disabled}
				onAction={handleBrowse}
			>
				Browse
			</Button>
		</Group>
	)

	function handleBrowse(): void {
		if (props.onBrowse) {
			props.onBrowse().then(dirPath => {
				if (dirPath) {
					setValue(dirPath)
					props.onSelect && props.onSelect(dirPath)
				}
			})
		}
	}

}