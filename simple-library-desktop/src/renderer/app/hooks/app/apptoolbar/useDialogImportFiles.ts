import {useDialogController, useReloadItems} from "../miscApplicationHooks";
import {useItems} from "../../base/itemHooks";
import {useActiveCollectionState} from "../../base/activeCollectionHooks";
import {useCollections} from "../../base/collectionHooks";
import {useComplexValidatedState} from "../../../../components/utils/commonHooks";
import {
	ImportProcessData,
	ImportTargetAction,
	RenamePart,
	RenamePartType,
	renamePartTypeAllowsUserInput
} from "../../../../../common/commonModels";

export function useDialogImportFilesController(): [boolean, () => void, () => void] {
	const [show, open, close] = useDialogController();
	return [show, open, close];
}


interface ImportValidationData {
	validFiles: boolean,
	validTargetDir: boolean,
	validRenameTypes: boolean,
	validRenameParts: boolean[]
}

export function useDialogImportFiles(onClose: () => void) {

	const {
		reloadItems
	} = useReloadItems();

	const {
		importItems,
	} = useItems()

	const {
		loadGroups
	} = useCollections()

	const [
		data,
		setData,
		dataValid,
		triggerDataValidation,
		refData,
		refDataValid
	] = useComplexValidatedState<ImportProcessData, ImportValidationData>(getInitialData, getInitialValidationData(), validateData)


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

	function getInitialValidationData(): ImportValidationData {
		return {
			validFiles: true,
			validTargetDir: true,
			validRenameTypes: true,
			validRenameParts: [true, true, true]
		}
	}

	function validateData(data: ImportProcessData): ImportValidationData {
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

	function allValid(data: ImportValidationData): boolean {
		return data.validFiles
			&& data.validTargetDir
			&& data.validRenameTypes
			&& data.validRenameParts.every(v => v)
	}

	function handleCancel() {
		onClose()
	}

	function handleImport() {
		if (triggerDataValidation()) {
			importItems(refData.current)
				.then(() => loadGroups())
				.then(() => reloadItems())
			onClose()
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

	return {
		data: data,
		dataValid: dataValid,
		handleCancel: handleCancel,
		handleImport: handleImport,
		handleSetFiles: handleSetFiles,
		handleSetTargetType: handleSetTargetType,
		handleSetTargetDir: handleSetTargetDir,
		handleOnRename: handleOnRename,
		handleSetRenameType: handleSetRenameType,
		handleSetRenameValue: handleSetRenameValue,
		areAllValid: allValid
	}


}