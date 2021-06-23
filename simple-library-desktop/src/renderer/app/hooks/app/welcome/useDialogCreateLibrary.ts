import {useDialogController} from "../miscApplicationHooks";
import {useLibraries} from "../../base/libraryHooks";
import {useValidatedForm, useValidatedState} from "../../../../components/utils/commonHooks";

const electron = window.require('electron');

export function useDialogCreateLibraryController() {
	return useDialogController();
}


export function useDialogCreateLibrary(onFinished: (created: boolean) => void) {

	const {
		createLibrary,
	} = useLibraries()

	const {
		registerAtForm,
		triggerFormValidation,
	} = useValidatedForm()

	const [
		getName,
		setName,
		isNameValid,
	] = useValidatedState("", true, validateName, registerAtForm)

	const [
		getTargetDir,
		setTargetDir,
		isTargetDirValid,
	] = useValidatedState("", true, validateTargetDir, registerAtForm)


	function validateName(name: string): boolean {
		return !!name && name.trim().length > 0
	}

	function validateTargetDir(targetDir: string): boolean {
		return !!targetDir && targetDir.trim().length > 0
	}

	function browseTargetDir(): Promise<string | null> {
		return electron.remote.dialog
			.showOpenDialog({
				title: 'Select target directory',
				buttonLabel: 'Select',
				properties: [
					'openDirectory',
					'createDirectory',
				],
			})
			.then((result: any) => {
				if (result.canceled) {
					return null;
				} else {
					return result.filePaths[0];
				}
			});
	}

	function create(): void {
		if (triggerFormValidation()) {
			createLibrary(getName(), getTargetDir())
				.then(() => onFinished(true))
		}
	}

	function cancel(): void {
		onFinished(false)
	}


	return {
		setName: setName,
		isNameValid: isNameValid,

		setTargetDir: setTargetDir,
		isTargetDirValid: isTargetDirValid,

		browseTargetDir: browseTargetDir,

		create: create,
		cancel: cancel
	}

}