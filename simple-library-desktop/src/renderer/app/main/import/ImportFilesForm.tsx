import * as React from 'react';
import { ReactElement } from 'react';
import { VBox } from '../../../components/layout/Box';
import { AlignCross, AlignMain, Size } from '../../../components/common';
import { Separator, SeparatorDirection } from '../../../components/separator/Separator';
import { ImportTargetAction, ImportProcessData, RenamePartType } from '../../../../common/commonModels';
import { SelectFilesForm } from './SelectFilesForm';
import { ImportTargetForm } from './ImportTargetForm';
import { RenameFilesForm } from './RenameFilesForm';

export interface ImportFilesFormProps {
    data: ImportProcessData,
    onSelectFiles?: () => void,
    onSelectImportTargetAction: (action: ImportTargetAction) => void,
    onSelectTargetDirectory: () => void,
    onToggleRenameFiles: (enabled: boolean) => void,
    onSetFilenamePartType: (index: number, type: RenamePartType) => void
    onSetFilenamePartValue: (index: number, value: string) => void

}


type ImportFilesFormReactProps = React.PropsWithChildren<ImportFilesFormProps>;


export function ImportFilesForm(props: ImportFilesFormReactProps): ReactElement {

    return (
        <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

            <SelectFilesForm files={props.data.files}
                             onSelectFiles={props.onSelectFiles} />

            <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

            <ImportTargetForm action={props.data.importTarget.action}
                              onSelectAction={props.onSelectImportTargetAction}
                              targetDir={props.data.importTarget.targetDir}
                              onSelectTargetDir={props.onSelectTargetDirectory} />

            <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

            <RenameFilesForm enabled={props.data.renameInstructions.doRename}
                             onToggleEnable={props.onToggleRenameFiles}
                             renameParts={props.data.renameInstructions.parts}
                             onSetRenamePartType={props.onSetFilenamePartType}
                             onSetRenamePartValue={props.onSetFilenamePartValue}
            />

        </VBox>
    );

}