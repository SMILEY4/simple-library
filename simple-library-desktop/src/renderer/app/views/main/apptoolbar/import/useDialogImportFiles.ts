import {useDialogController} from "../../../../hooks/base/miscApplicationHooks";
import {useComplexValidatedState} from "../../../../../components/utils/commonHooks";
import {renamePartTypeAllowsUserInput} from "../../../../common/utils";
import {
	ImportProcessDataDTO,
	ImportTargetActionDTO,
	RenamePartDTO,
	RenamePartTypeDTO
} from "../../../../../../common/events/dtoModels";
import {useImportItems} from "../../../../hooks/logic/core/itemsImport";

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

	const importItems = useImportItems();

	const [
		data,
		setData,
		dataValid,
		triggerDataValidation,
		refData,
		refDataValid
	] = useComplexValidatedState<ImportProcessDataDTO, ImportValidationData>(getInitialData, getInitialValidationData(), validateData)


	function getInitialData(): ImportProcessDataDTO {
		return {
			files: [],
			importTarget: {
				action: "keep",
				targetDir: ""
			},
			renameInstructions: {
				doRename: false,
				parts: [
					{type: "nothing", value: ""},
					{type: "original_filename", value: ""},
					{type: "nothing", value: ""},
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

	function validateData(data: ImportProcessDataDTO): ImportValidationData {
		return {
			validFiles: data.files.length > 0,
			validTargetDir: data.importTarget.action === "keep" ? true : data.importTarget.targetDir.length > 0,
			validRenameTypes: data.renameInstructions.doRename ? data.renameInstructions.parts.some(p => p.type !== "nothing") : true,
			validRenameParts: data.renameInstructions.doRename ? data.renameInstructions.parts.map(p => {
				switch (p.type) {
					case "nothing":
						return true;
					case "text":
						return !!p.value && p.value.trim().length > 0;
					case "number_from":
						return !!p.value && p.value.trim().length > 0 && !isNaN(parseInt(p.value)) && parseInt(p.value) >= 0;
					case "original_filename":
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

	function handleSetTargetType(type: ImportTargetActionDTO): void {
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

	function handleSetRenameType(index: number, type: RenamePartTypeDTO): void {
		const newParts: RenamePartDTO[] = [...data.renameInstructions.parts]
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
		const newParts: RenamePartDTO[] = [...data.renameInstructions.parts]
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
