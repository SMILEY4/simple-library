import React from "react";
import {Dialog} from "../../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../Application";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Button} from "../../../../../components/buttons/button/Button";
import {VBox} from "../../../../../components/layout/box/Box";
import {ImportSelectFilesForm} from "./ImportSelectFilesForm";
import {ImportTargetDirForm} from "./ImportTargetDirForm";
import {ImportRenameFilesForm} from "./ImportRenameFilesForm";
import {useDialogImportFiles} from "../../../../hooks/app/apptoolbar/useDialogImportFiles";
import {ImportTargetActionDTO} from "../../../../../../common/messaging/dtoModels";

interface DialogImportFilesProps {
	onClose: () => void,
}

export function DialogImportFiles(props: React.PropsWithChildren<DialogImportFilesProps>): React.ReactElement {

	const {
		data,
		dataValid,
		handleCancel,
		handleImport,
		handleSetFiles,
		handleSetTargetType,
		handleSetTargetDir,
		handleOnRename,
		handleSetRenameType,
		handleSetRenameValue,
		areAllValid
	} = useDialogImportFiles(props.onClose)

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
				<Button variant="info" disabled={!areAllValid(dataValid)} onAction={handleImport}>Import</Button>
			</Slot>
		</Dialog>
	);

}
