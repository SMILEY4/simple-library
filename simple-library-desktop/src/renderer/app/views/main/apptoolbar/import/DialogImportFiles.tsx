import React from "react";
import {Dialog} from "../../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../application";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Button} from "../../../../../components/buttons/button/Button";
import {useItems} from "../../../../hooks/itemHooks";
import {VBox} from "../../../../../components/layout/box/Box";
import {
	ImportProcessData,
	ImportTargetAction,
	RenamePart,
	RenamePartType,
	renamePartTypeAllowsUserInput
} from "../../../../../../common/commonModels";
import {ImportSelectFilesForm} from "./ImportSelectFilesForm";
import {ImportTargetDirForm} from "./ImportTargetDirForm";
import {ImportRenameFilesForm} from "./ImportRenameFilesForm";
import {useCollections} from "../../../../hooks/collectionHooks";
import {useGroups} from "../../../../hooks/groupHooks";
import {useComplexValidatedState} from "../../../../../components/utils/commonHooks";

interface DialogImportFilesProps {
	onClose: () => void,
}

interface ValidationData {
	validFiles: boolean,
	validTargetDir: boolean,
	validRenameTypes: boolean,
	validRenameParts: boolean[]
}

export function DialogImportFiles(props: React.PropsWithChildren<DialogImportFilesProps>): React.ReactElement {

	const {
		importItems,
		loadItems
	} = useItems()

	const {
		activeCollectionId
	} = useCollections()

	const {
		loadGroups
	} = useGroups()

	const [
		data,
		setData,
		dataValid,
		triggerDataValidation,
		refData,
		refDataValid
	] = useComplexValidatedState<ImportProcessData, ValidationData>(getInitialData, getInitialValidationData(), validateData)

	function getInitialData(): ImportProcessData {
		return {
			files: [],
			importTarget: {
				action: ImportTargetAction.KEEP,
				targetDir: ""
			},
			renameInstructions: {
				doRename: false,
				parts: [
					{
						type: RenamePartType.NOTHING,
						value: ""
					},
					{
						type: RenamePartType.NOTHING,
						value: ""
					},
					{
						type: RenamePartType.ORIGINAL_FILENAME,
						value: ""
					},
				]
			}
		}
	}

	function getInitialValidationData(): ValidationData {
		return {
			validFiles: true,
			validTargetDir: true,
			validRenameTypes: true,
			validRenameParts: [true, true, true]
		}
	}

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
				<VBox alignMain="center" alignCross="stretch" spacing="1-5" style={{
					paddingTop: "var(--s-0-5)",
					paddingBottom: "var(--s-0-5)"
				}}>
					<ImportSelectFilesForm
						error={!dataValid.validFiles}
						onSelectFiles={handleSetFiles}
					/>
					<ImportTargetDirForm
						error={!dataValid.validTargetDir}
						targetType={data.importTarget.action}
						onSetTargetType={handleSetTargetType}
						onSetTargetDir={handleSetTargetDir}
					/>
					<ImportRenameFilesForm
						rename={data.renameInstructions.doRename}
						onRename={handleOnRename}
						renameParts={data.renameInstructions.parts}
						sampleFile={data.files.length > 0 ? data.files[0] : null}
						errorTypes={!dataValid.validRenameTypes}
						errorValues={(dataValid.validRenameParts as boolean[]).map(v => !v)}
						onSelectType={handleSetRenameType}
						onSelectValue={handleSetRenameValue}
						onChangeValue={handleSetRenameValue}
					/>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!allValid(dataValid)} onAction={handleImport}>Import</Button>
			</Slot>
		</Dialog>
	);


	function validateData(data: ImportProcessData): ValidationData {
		return {
			validFiles: data.files.length > 0,
			validTargetDir: data.importTarget.action === ImportTargetAction.KEEP ? true : data.importTarget.targetDir.length > 0,
			validRenameTypes: data.renameInstructions.doRename ? data.renameInstructions.parts.some(p => p.type !== RenamePartType.NOTHING) : true,
			validRenameParts: data.renameInstructions.doRename ? data.renameInstructions.parts.map(p => {
				switch (p.type) {
					case RenamePartType.NOTHING:
						return true;
					case RenamePartType.TEXT:
						return !!p.value && p.value.trim().length > 0;
					case RenamePartType.NUMBER_FROM:
						return !!p.value && p.value.trim().length > 0 && !isNaN(parseInt(p.value)) && parseInt(p.value) >= 0;
					case RenamePartType.ORIGINAL_FILENAME:
						return true;
				}
			}) : [true, true, true]
		}
	}

	function allValid(data: ValidationData): boolean {
		return data.validFiles
			&& data.validTargetDir
			&& data.validRenameTypes
			&& data.validRenameParts.every(v => v)
	}

	function handleCancel() {
		props.onClose()
	}

	function handleImport() {
		if (triggerDataValidation()) {
			importItems(refData.current)
			.then(() => loadGroups())
			.then(() => activeCollectionId && loadItems(activeCollectionId))
			props.onClose()
		}
	}

	function handleSetFiles(files: string[]): void {
		setData({
			files: files,
			importTarget: data.importTarget,
			renameInstructions: data.renameInstructions
		})
	}

	function handleSetTargetType(type: ImportTargetAction): void {
		setData({
			files: data.files,
			importTarget: {
				action: type,
				targetDir: data.importTarget.targetDir
			},
			renameInstructions: data.renameInstructions
		})
	}

	function handleSetTargetDir(targetDir: string): void {
		setData({
			files: data.files,
			importTarget: {
				action: data.importTarget.action,
				targetDir: targetDir
			},
			renameInstructions: data.renameInstructions
		})
	}

	function handleOnRename(rename: boolean): void {
		setData({
			files: data.files,
			importTarget: data.importTarget,
			renameInstructions: {
				doRename: rename,
				parts: data.renameInstructions.parts
			}
		})
	}

	function handleSetRenameType(index: number, type: RenamePartType): void {
		const newParts: RenamePart[] = [...data.renameInstructions.parts]
		newParts[index].type = type;
		if (!renamePartTypeAllowsUserInput(type)) {
			newParts[index].value = ""
		}

		setData({
			files: data.files,
			importTarget: data.importTarget,
			renameInstructions: {
				doRename: data.renameInstructions.doRename,
				parts: newParts
			}
		})
	}

	function handleSetRenameValue(index: number, value: string): void {
		const newParts: RenamePart[] = [...data.renameInstructions.parts]
		newParts[index].value = value;

		setData({
			files: data.files,
			importTarget: data.importTarget,
			renameInstructions: {
				doRename: data.renameInstructions.doRename,
				parts: newParts
			}
		})
	}

}
