import React from "react";
import {Dialog} from "../../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../application";
import {Slot} from "../../../../../newcomponents/base/slot/Slot";
import {Button} from "../../../../../newcomponents/buttons/button/Button";
import {useItems} from "../../../../hooks/itemHooks";
import {VBox} from "../../../../../newcomponents/layout/box/Box";
import {useValidatedState} from "../../../../hooks/miscHooks";
import {
	ImportProcessData,
	ImportTargetAction,
	RenamePartType,
	renamePartTypeAllowsUserInput
} from "../../../../../../common/commonModels";
import {useStateRef} from "../../../../../components/common/commonHooks";
import {ImportSelectFilesForm} from "./ImportSelectFilesForm";
import {ImportTargetDirForm} from "./ImportTargetDirForm";
import {ImportRenameFilesForm} from "./ImportRenameFilesForm";

interface DialogImportFilesProps {
	onClose: () => void,
}

export function DialogImportFiles(props: React.PropsWithChildren<DialogImportFilesProps>): React.ReactElement {

	const {
		importItems
	} = useItems()

	const [
		files,
		setFiles,
		filesValid,
		triggerFileValidation,
		refFiles,
		refFilesValid
	] = useValidatedState<string[]>([], true, validateFiles)

	const [
		fileTargetType,
		setFileTargetType,
		refFileTargetType
	] = useStateRef<string>(ImportTargetAction.KEEP)

	const [
		targetDir,
		setTargetDir,
		targetDirValid,
		triggerTargetDirValidation,
		refTargetDir,
		refTargetDirValid
	] = useValidatedState<string | null>(null, true, validateTargetDir)

	const [
		renameFiles,
		setRenameFiles,
		refRenameFiles
	] = useStateRef(false)

	const [
		renamePartTypes,
		setRenamePartTypes,
		renamePartTypesValid,
		triggerRenamePartTypesValidation,
		refRenamePartTypes,
		refRenamePartTypesValid
	] = useValidatedState<RenamePartType[]>([
		RenamePartType.NOTHING,
		RenamePartType.NOTHING,
		RenamePartType.ORIGINAL_FILENAME
	], [true], validateRenameTypes)

	const [
		renamePartValues,
		setRenamePartValues,
		renamePartValuesValid,
		triggerRenamePartValuesValidation,
		refRenamePartValues,
		refRenamePartValuesValid
	] = useValidatedState<(string | null)[]>([null, null, null], [true, true, true], validateRenameValues)

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Import Files"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleImport}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="1-5">
					<ImportSelectFilesForm
						error={!filesValid}
						onSelectFiles={setFiles}
					/>
					<ImportTargetDirForm
						error={!targetDirValid}
						targetType={fileTargetType}
						onSetTargetType={setFileTargetType}
						onSetTargetDir={setTargetDir}
					/>
					<ImportRenameFilesForm
						rename={renameFiles}
						onRename={setRenameFiles}
						types={renamePartTypes}
						values={renamePartValues}
						errorTypes={!renamePartTypesValid}
						errorValues={(renamePartValuesValid as boolean[]).map(v => !v)}
						onSelectType={handleSelectRenameType}
						onSelectValue={handleSelectRenameValue}
						onChangeValue={handleChangeRenameValue}
					/>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!isEverythingValid()} onAction={handleImport}>Import</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function isEverythingValid() {
		const valid =  refFilesValid.current
			&& refTargetDirValid.current
			&& refRenamePartTypesValid.current
			&& (refRenamePartValuesValid.current as boolean[]).every(v => v === true);
		console.log("all", valid)
		console.log(refFilesValid.current)
		console.log(refTargetDirValid.current)
		console.log(refRenamePartTypesValid.current)
		console.log((refRenamePartValuesValid.current as boolean[]).every(v => v === true))

		return valid;
	}

	function handleImport() {
		triggerFileValidation();
		triggerTargetDirValidation();
		triggerRenamePartTypesValidation();
		triggerRenamePartValuesValidation()
		if (isEverythingValid()) {

			console.log("IMPORT", buildProcessData())

			// importItems(buildProcessData());
			// props.onClose();
		}
	}

	function buildProcessData(): ImportProcessData {
		return {
			files: refFiles.current,
			importTarget: {
				action: refFileTargetType.current === "keep"
					? ImportTargetAction.KEEP
					: refFileTargetType.current === "move" ? ImportTargetAction.MOVE : ImportTargetAction.COPY,
				targetDir: refTargetDir.current
			},
			renameInstructions: {
				doRename: refRenameFiles.current,
				parts: refRenameFiles.current
					? refRenamePartTypes.current.map((type: RenamePartType, index:number) => {
						return {
							type: type,
							value: refRenamePartValues.current[index] ? refRenamePartValues.current[index] : ""
						}
					}) : []
			}
		}
	}


	//==================//
	//   SELECT FILES   //
	//==================//

	function validateFiles(files: string[]): boolean {
		console.log("files", files)
		return files.length > 0;
	}

	//==================//
	//    TARGET DIR    //
	//==================//

	function validateTargetDir(targetDir: string | null): boolean {
		if (refFileTargetType.current === ImportTargetAction.KEEP) {
			return true;
		} else {
			return targetDir && targetDir.trim().length > 0
		}
	}

	//==================//
	//   RENAME FILES   //
	//==================//

	function validateRenameTypes(types: RenamePartType[]): boolean {
		triggerRenamePartValuesValidation()
		return types.some((type: RenamePartType) => type !== RenamePartType.NOTHING);
	}

	function validateRenameValues(values: (string | null)[]): boolean[] {
		return values.map((value: string, index: number) => {
			const type: RenamePartType = refRenamePartTypes.current[index];
			if (renamePartTypeAllowsUserInput(type)) {
				if (!value || value.trim().length === 0) {
					return false;
				}
				return !(type === RenamePartType.NUMBER_FROM && isNaN(parseInt(value)));
			} else {
				return true;
			}
		})
	}

	function handleSelectRenameType(index: number, type: RenamePartType): void {
		const types: RenamePartType[] = [...renamePartTypes]
		types[index] = type;
		setRenamePartTypes(types)
		if (!renamePartTypeAllowsUserInput(type)) {
			const values: (string | null)[] = [...renamePartValues]
			values[index] = null;
			setRenamePartValues(values)
		}
	}

	function handleSelectRenameValue(index: number, value: string): void {
		const values: (string | null)[] = [...renamePartValues]
		values[index] = value;
		setRenamePartValues(values)
	}

	function handleChangeRenameValue(index: number, value: string): void {
		const values: (string | null)[] = [...renamePartValues]
		values[index] = value;
		setRenamePartValues(values)
	}

}
