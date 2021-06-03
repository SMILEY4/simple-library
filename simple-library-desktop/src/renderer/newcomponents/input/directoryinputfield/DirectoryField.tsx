import {BaseProps} from "../../utils/common";
import React, {useState} from "react";
import {Group} from "../../layout/group/Group";
import {TextField} from "../textfield/TextField";
import {IconType} from "../../base/icon/Icon";
import {Button} from "../../buttons/button/Button";
import {concatClasses} from "../../../components/common/common";

interface DirectoryFieldProps extends BaseProps {
	value?: string,
	disabled?: boolean,
	placeholder?: string,
	error?: boolean,
	onBrowse?: () => Promise<string | null>
	onSelect?: (dirPath: string) => void,
}

export function DirectoryField(props: React.PropsWithChildren<DirectoryFieldProps>): React.ReactElement {

	const [value, setValue] = useState(props.value ? props.value : "");

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
				dir="rtl"
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