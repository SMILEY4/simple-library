import {BaseProps} from "../../utils/common";
import React, {useRef, useState} from "react";
import {Group} from "../../layout/group/Group";
import {TextField} from "../textfield/TextField";
import {IconType} from "../../base/icon/Icon";
import {Button} from "../../buttons/button/Button";
import {concatClasses} from "../../../components/common/common";
import "./fileInputField.css"
import {useMount} from "../../../app/hooks/miscHooks";

interface FileInputFieldProps extends BaseProps {
	files?: string[],
	disabled?: boolean,
	placeholder?: string,
	error?: boolean,
	onBrowse?: () => Promise<string[] | null>
	onSelect?: (files: string[]) => void,
}

export function FileInputField(props: React.PropsWithChildren<FileInputFieldProps>): React.ReactElement {

	const [files, setFiles] = useState(props.files ? props.files : []);

	const fieldRef = useRef(null);
	useMount(() => {
		fieldRef.current.scrollLeft = fieldRef.current.scrollWidth
	})

	return (
		<Group
			className={concatClasses(props.className, "file-field")}
			error={props.error}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			<TextField
				value={buildDisplayText(files)}
				forceState
				fixed
				disabled={props.disabled}
				placeholder={props.placeholder}
				prependIcon={IconType.FILE}
				refInputField={fieldRef}
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
			props.onBrowse().then(filePaths => {
				if (filePaths) {
					setFiles(filePaths)
					fieldRef.current.scrollLeft = fieldRef.current.scrollWidth
					props.onSelect && props.onSelect(filePaths)
				}
			})
		}
	}

	function buildDisplayText(files: string[]): string | undefined {
		switch (files.length) {
			case 0: {
				return undefined
			}
			case 1: {
				return files[0]
			}
			default: {
				return files.length + " files selected"
			}
		}
	}

}