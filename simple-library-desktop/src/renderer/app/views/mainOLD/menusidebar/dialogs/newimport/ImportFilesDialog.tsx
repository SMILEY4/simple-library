import * as React from 'react';
import { ReactElement } from 'react';
import { VBox } from '../../../../../../components/layout/box/Box';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../../components/common/common';
import { Separator, SeparatorDirection } from '../../../../../../components/_old/separator/Separator';
import { ImportProcessData } from '../../../../../../../common/commonModels';
import { SelectFilesForm } from './SelectFilesForm';
import { ImportTargetForm } from './ImportTargetForm';
import { useFilesToImport, useImportTarget, useRenameImportFiles } from '../../../../../hooks/old/importHooks';
import * as electron from 'electron';
import { Dialog } from '../../../../../../components/_old/modal/Dialog';
import { RenameFilesForm } from './RenameFilesForm';

export interface ImportFilesDialogProps {
    onClose: () => void
    onImport: (data: ImportProcessData) => void
}


export function ImportFilesDialog(props: React.PropsWithChildren<ImportFilesDialogProps>): ReactElement {

    const {
        filesToImport,
        filesToImportValid,
        selectFilesToImport,
        getRefFilesToImport,
    } = useFilesToImport();

    const {
        targetDir,
        targetDirValid,
        selectTargetDir,
        getRefTargetDir,
        targetType,
        selectTargetType,
        getRefTargetType,
    } = useImportTarget();

    const {
        renameEnabled,
        getRefRenameEnabled,
        setRenameEnabled,
        renameParts,
        getRefRenameParts,
        setPartType,
        setPartValue,
        renameValid,
        invalidRenameParts,
    } = useRenameImportFiles();

    return (
        <Dialog title={"Import Files"}
                show={true}
                closeButton={true}
                onClose={props.onClose}
                actions={[
                    {
                        content: "Cancel",
                        variant: Variant.OUTLINE,
                        onAction: props.onClose,
                    },
                    {
                        content: "Import",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: handleDoImport,
                    },
                ]}>

            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

                <SelectFilesForm files={filesToImport}
                                 onSelectFiles={handleSelectFiles}
                                 invalid={!filesToImportValid} />

                <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                <ImportTargetForm action={targetType}
                                  onSelectAction={selectTargetType}
                                  targetDir={targetDir}
                                  onSelectTargetDir={handleSelectTargetDir}
                                  targetDirInvalid={!targetDirValid} />

                <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                <RenameFilesForm enabled={renameEnabled}
                                 onToggleEnable={setRenameEnabled}
                                 renameParts={renameParts}
                                 onSetRenamePartType={setPartType}
                                 onSetRenamePartValue={setPartValue}
                                 renameDataInvalid={renameValid}
                                 invalidRenamePartValues={invalidRenameParts}
                />

            </VBox>

        </Dialog>


    );

    function handleSelectFiles() {
        electron.remote.dialog
            .showOpenDialog({
                title: 'Select Files',
                buttonLabel: 'Select',
                properties: [
                    'openFile',
                    'multiSelections',
                    'dontAddToRecent',
                ],
            })
            .then((result: any) => {
                if (!result.canceled) {
                    selectFilesToImport(result.filePaths);
                }
            });
    }

    function handleSelectTargetDir() {
        electron.remote.dialog
            .showOpenDialog({
                title: 'Select target directory',
                buttonLabel: 'Select',
                properties: [
                    'openDirectory',
                    'createDirectory',
                ],
            })
            .then((result: any) => {
                if (!result.canceled) {
                    selectTargetDir(result.filePaths[0]);
                }
            });
    }

    function handleDoImport() {
        if (filesToImportValid && targetDirValid) {
            // todo: create data
            // props.onImport(undefined);
        }
    }

}